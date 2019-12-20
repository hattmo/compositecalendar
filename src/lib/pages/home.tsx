import React, { useEffect, useState } from "react";
import { ICalendar, ISetting } from "../../types";
import useDrive from "../helpers/useDrive";
import Rule from "../components/rule";

interface IProps {
    accessToken: string;
    logout: (message: string) => void;
}

export default ({ logout, accessToken }: IProps) => {
    const [calendarList, setCalendarList] = useState<ICalendar[]>([]);
    const [savedSettings, setSavedSettings] = useDrive<ISetting>("compositeCalendarData", {
        startDate: "",
        endDate: "",
        inputCals: [],
        regex: "",
    }, accessToken);
    console.log(savedSettings);
    useEffect(() => {
        (async () => {
            const response = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
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
    }, [accessToken]);
    return (
        <div>
            <h1>HOME</h1>
            <Rule savedSettings={savedSettings} setSavedSettings={setSavedSettings}
                accessToken={accessToken} calendarList={calendarList} logout={logout} />
            <button onClick={() => { logout("Logout Successful"); }}>logout</button>
        </div>
    );
};
