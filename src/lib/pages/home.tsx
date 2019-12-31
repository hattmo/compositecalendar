import React, { useEffect, useState } from "react";
import { ICalendar, ISetting } from "../../types";
import useDrive from "../helpers/useDrive";
import Rule from "../components/rule";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
    accessToken: string;
    logout: (message: string) => void;
}

export default ({ logout, accessToken, ...rest }: IProps) => {
    const [calendarList, setCalendarList] = useState<ICalendar[]>([]);
    const [savedSettings, setSavedSettings] = useDrive<ISetting[]>("compositeCalendarData", [{
        startDate: "",
        endDate: "",
        inputItems: [],
    }], accessToken);
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
        <div {...rest}>
            <h1>HOME</h1>
            {savedSettings.map((item, index) => {
                return (<Rule
                    key={index}
                    savedSettings={item}
                    accessToken={accessToken} calendarList={calendarList} logout={logout}
                    setSavedSettings={(newSetting) => {
                        setSavedSettings(savedSettings.map((oldSetting, i) => {
                            if (i === index) {
                                return newSetting;
                            } else {
                                return oldSetting;
                            }
                        }));
                    }}
                    remove={() => {
                        setSavedSettings(savedSettings.filter((_oldSetting, i) => {
                            return i !== index;
                        }));
                    }}
                />);
            })}
            <button onClick={() => {
                setSavedSettings([...savedSettings, {
                    startDate: "",
                    endDate: "",
                    inputItems: [],
                }]);
            }}>Add Rule</button>
            <button onClick={() => { logout("Logout Successful"); }}>Logout</button>
        </div>
    );
};
