import React, { useEffect, useState } from "react";
import { ICalendar, ISetting } from "../../types";
import useDrive from "../helpers/useDrive";
import Rule from "../components/rule";
import logoutImg from "../../assets/logout.png";
interface IProps extends React.HTMLAttributes<HTMLDivElement> {
    accessToken: string;
    logout: (message: string) => void;
}

export default ({ logout, accessToken, style, ...rest }: IProps) => {
    const [calendarList, setCalendarList] = useState<ICalendar[]>([]);
    const [savedSettings, setSavedSettings] = useDrive<ISetting[]>("compositeCalendarData", [{
        startDate: "",
        endDate: "",
        inputItems: [],
    }], accessToken, () => {
        logout("Token Expired");
    });
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
        <div style={{ ...defaultStyle, ...style }} {...rest}>
            <div style={{
                fontSize: "30pt",
            }}>Composite Calendar</div>
            {
                savedSettings.map((item, index) => {
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
                })
            }
            <div
                style={{
                    border: "1px solid black",
                    justifySelf: "stretch",
                    padding: "2px",
                    borderRadius: "5px",
                    textAlign: "center",
                    backgroundColor: "lavender",
                    cursor: "pointer",
                }}
                onClick={() => {
                    setSavedSettings([...savedSettings, {
                        startDate: "",
                        endDate: "",
                        inputItems: [],
                    }]);
                }}>Add Rule</div>
            <a style={{ position: "fixed", right: "0px", cursor: "pointer" }}
                onClick={() => { logout("Logout Successful"); }}>
                <img style={{ padding: "5px", width: "30px" }} src={logoutImg} />
            </a>
        </div >
    );
};

const defaultStyle: React.CSSProperties = {
    justifyContent: "center",
    gridTemplateColumns: "min-content",
    display: "grid",
    placeItems: "center",
    gap: "5px",
};
