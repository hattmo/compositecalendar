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
            if (response.ok) {
                const json = await response.json();
                const filtered = json.items.map((item) => {
                    return {
                        id: item.id,
                        name: item.summary,
                        accessRole: item.accessRole,
                    };
                });
                setCalendarList(filtered);
            } else {
                logout("");
            }
        })();
    }, [access_token]);
    return (
        <div>
            <h1>HOME</h1>
            <Rule access_token={access_token} calendarList={calendarList} logout={logout} />
            <button onClick={() => { logout("Logout Successful"); }}>logout</button>
        </div>
    );
};
