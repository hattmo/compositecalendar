import { ICalendar, IEventList, IEvent, IInputItem } from "../../types";
import convertTime from "./convertTime";
import wait from "./wait";

export const removeEventsFromOutput = async (
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

export const addEventsToOutput = async (
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
            await wait(2000);
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

export const getFilteredEvents = async (
    inputItems: IInputItem[],
    startDate: string,
    endDate: string,
    accessToken: string,
) => {
    const isoMin = convertTime(startDate, false);
    const isoMax = convertTime(endDate, true);
    return (await Promise.all(inputItems.map(async (inputItem) => {
        const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${inputItem.cal.id}/events?timeMin=${isoMin}&timeMax=${isoMax}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (!response.ok) {
            throw new Error("Unauthorized Token");
        }
        const events = await response.json() as IEventList;
        const compiledRegex = new RegExp(inputItem.regex);
        return events.items.filter((event) => {
            if (inputItem.exclude) {
                return !compiledRegex.test(event.summary);
            } else {
                return compiledRegex.test(event.summary);
            }
        });
    }))).reduce((prev, curr) => {
        return [...prev, ...curr];
    }, [] as IEvent[]);
};
