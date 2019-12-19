import React, { useEffect, useState } from "react";
import { ICalendar } from "../../types";
import Rule from "../components/rule";

interface IProps {
    access_token: string;
    logout: (message: string) => void;
}

export default ({ logout, access_token }: IProps) => {
    const [calendarList, setCalendarList] = useState<ICalendar[]>([]);
    useEffect(() => {
        (async () => {
            const response = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
            const filtered = (await response.json()).items.map((item) => {
                return {
                    id: item.id,
                    name: item.summary,
                };
            });
            setCalendarList(filtered);
        })();
    }, [access_token]);
    return (
        <div>
            <h1>HOME</h1>
            <Rule calendarList={calendarList} />
            <button onClick={() => { logout("Logout Successful"); }}>logout</button>
        </div>
    );
};
