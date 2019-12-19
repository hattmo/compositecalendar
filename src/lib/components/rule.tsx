import React, { useState, useMemo, useCallback } from "react";
import InputCalBlock from "./inputCal/inputCalBlock";
import { ICalendar } from "../../types";
import FilterBlock from "./filter/filterBlock";
import OutputCalBlock from "./outputCal/outputCalBlock";

interface IProps {
    calendarList: ICalendar[];
    access_token: string;
    logout: (message: string) => void;
}

export default ({ calendarList, access_token }: IProps) => {
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
    const getEvents = useCallback(
        async (calendarID: string) => {
            const isoMin = (new Date(startDate)).toISOString();
            const isoMax = (new Date(endDate)).toISOString();
            const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events?timeMin=${isoMin}&timeMax=${isoMax}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
            return await res.json();
        },
        [access_token, startDate, endDate],
    );
    return (
        <div>
            <InputCalBlock calendarList={calendarList} inputCals={inputCals} setInputCals={setInputCals} />
            <FilterBlock validRegex={checkRegex(regex)} startDate={startDate} endDate={endDate} regex={regex}
                setStartDate={setStartDate} setEndDate={setEndDate} setRegex={setRegex} />
            <OutputCalBlock calendarList={writableCalendars} outputCal={outputCal} setOutputCal={setOutputCal} />
            <button onClick={() => {
                if (outputCal !== undefined) {
                    getEvents(outputCal.id).then((val) => {
                        console.log(val);
                    });
                }
            }}>Build</button>
        </div>
    );
};

function checkRegex(regex: string): boolean {
    try {
        new RegExp(regex);
        return true;
    } catch (e) {
        return false;
    }
}
