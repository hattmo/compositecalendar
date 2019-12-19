import React, { useState, useMemo } from "react";
import InputCalBlock from "./inputCal/inputCalBlock";
import { ICalendar, IEventList, IEvent } from "../../types";
import FilterBlock from "./filter/filterBlock";
import OutputCalBlock from "./outputCal/outputCalBlock";
import wait from "./helpers/wait";
interface IProps {
    calendarList: ICalendar[];
    accessToken: string;
    logout: (message: string) => void;
}

export default ({ calendarList, accessToken: accessToken, logout }: IProps) => {
    const [errorMessage, setErrorMessage] = useState(<div />);
    const [inputCals, setInputCals] = useState<ICalendar[]>([]);
    const [outputCal, setOutputCal] = useState<ICalendar>();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [regex, setRegex] = useState("");
    const writableCalendars = useMemo(() => {
        return calendarList.filter((item) => {
            return (item.accessRole === "writer" || item.accessRole === "owner");
        });
    }, [calendarList]);
    return (
        <div>
            <InputCalBlock calendarList={calendarList} inputCals={inputCals} setInputCals={setInputCals} />
            <FilterBlock validRegex={checkRegex(regex)} startDate={startDate} endDate={endDate} regex={regex}
                setStartDate={setStartDate} setEndDate={setEndDate} setRegex={setRegex} />
            <OutputCalBlock calendarList={writableCalendars} outputCal={outputCal} setOutputCal={setOutputCal} />
            <button onClick={async () => {
                if (inputCals.length === 0) {
                    setErrorMessage(<div>Please select one or more input calendars</div>);
                    return;
                } else if (startDate === "" || endDate === "") {
                    setErrorMessage(<div>Please select a start and end date</div>);
                    return;
                } else if (outputCal === undefined) {
                    setErrorMessage(<div>Please select an output calendar</div>);
                    return;
                } else {
                    setErrorMessage(<div />);
                }
                try {
                    const filteredEvents = await getFilteredEvents(inputCals, startDate, endDate, regex, accessToken);
                    await removeEventsFromOutput(outputCal, startDate, endDate, accessToken);
                    await addEventsToOutput(outputCal, filteredEvents, accessToken);
                    setErrorMessage(<div>Done</div>);
                } catch (e) {
                    if (e.message === "Invalid Date") {
                        setErrorMessage(<div>Please select a start and end date</div>);
                        return;
                    } else if (e.message === "Unauthorized Token") {
                        logout("Token Expired");
                        return;
                    }
                }
            }}>Build</button>
            {errorMessage}
        </div>
    );
};

const removeEventsFromOutput = async (
    outputCal: ICalendar,
    startDate: string,
    endDate: string,
    accessToken: string,
) => {
    const isoMin = convertTime(startDate, false);
    const isoMax = convertTime(endDate, true);
    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${outputCal.id}/events?timeMin=${isoMin}&timeMax=${isoMax}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!response.ok) {
        throw new Error("Unauthorized Token");
    }
    const events = await response.json() as IEventList;
    const ids = events.items.map((item) => item.id);
    let eventid;
    for (eventid of ids) {
        const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${outputCal.id}/events/${eventid}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (res.status === 403) {
            await wait(1000);
            const res2 = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${outputCal.id}/events/${eventid}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!res2.ok) {
                throw new Error("Unauthorized Token");
            }
        } else if (!res.ok) {
            throw new Error("Unauthorized Token");
        }
    }
};

const addEventsToOutput = async (
    outputCal: ICalendar,
    filteredEvents: IEvent[],
    accessToken: string,
) => {

    const reducedEvents = filteredEvents
        .map((item) => {
            return {
                summary: item.summary,
                start: item.start,
                end: item.end,
            };
        });
    let reducedEvent;
    for (reducedEvent of reducedEvents) {
        const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${outputCal.id}/events`, {
            method: "POST",
            body: JSON.stringify(reducedEvent),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });
        if (res.status === 403) {
            await wait(1000);
            const res2 = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${outputCal.id}/events`, {
                method: "POST",
                body: JSON.stringify(reducedEvent),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
            });
            if (!res2.ok) {
                throw new Error("Unauthorized Token");
            }
        } else if (!res.ok) {
            throw new Error("Unauthorized Token");
        }
    }
};

const getFilteredEvents = async (
    inputCals: ICalendar[],
    startDate: string,
    endDate: string,
    regex: string,
    accessToken: string,
) => {
    const isoMin = convertTime(startDate, false);
    const isoMax = convertTime(endDate, true);
    const compiledRegex = new RegExp(regex);
    const results = await Promise.all(inputCals.map(async (item) => {
        const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${item.id}/events?timeMin=${isoMin}&timeMax=${isoMax}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (!response.ok) {
            throw new Error("Unauthorized Token");
        }
        return await response.json() as IEventList;
    }));
    const filteredList = results
        .reduce((prev, curr) => {
            return [...prev, ...curr.items];
        }, [] as IEvent[])
        .filter((item) => {
            return compiledRegex.test(item.summary);
        });
    return filteredList;
};

const checkRegex = (regex: string): boolean => {
    try {
        // tslint:disable-next-line: no-unused-expression
        new RegExp(regex);
        return true;
    } catch (e) {
        return false;
    }
};

const convertTime = (date: string, end: boolean): string => {
    let timeZoneOffsetMinutes = new Date().getTimezoneOffset();
    let timeZoneOffset = "";
    if (timeZoneOffsetMinutes !== 0) {
        timeZoneOffset = timeZoneOffsetMinutes > 0 ? "-" : "+";
        timeZoneOffsetMinutes = Math.abs(timeZoneOffsetMinutes);
        let hours = Math.floor(timeZoneOffsetMinutes / 60).toString();
        hours = hours.length === 1 ? "0" + hours : hours;
        let mins = (timeZoneOffsetMinutes % 60).toString();
        mins = mins.length === 1 ? "0" + mins : mins;
        timeZoneOffset = timeZoneOffset + hours + mins;
    } else {
        timeZoneOffset = "Z";
    }
    try {
        const dateObj = new Date(date);
        if (end) { dateObj.setDate(dateObj.getDate() + 1); }
        const iso = dateObj.toISOString();
        const isoAdjusted = iso.substring(0, iso.length - 1) + timeZoneOffset;
        return isoAdjusted;
    } catch {
        throw new Error("Invalid Date");
    }

};
