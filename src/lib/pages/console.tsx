import React, { useState } from "react";
import { ICalendar, ISetting } from "../../types";
import Rule from "../components/rule";
import logoutImg from "../../assets/logout.png";
import useCalendarList from "../helpers/useCalendarList";
interface IProps extends React.HTMLAttributes<HTMLDivElement> {
    logout: (message: string) => void;
}

export default ({ logout, style, ...rest }: IProps) => {
    const [calendarList, setCalendarList] = useState<ICalendar[]>([]);
    const [currentSettings, setCurrentSettings] = useState<ISetting[]>([]);
    const writeableCalendarList = calendarList.filter((item) => item.accessRole === "writer" || item.accessRole === "owner");
    useCalendarList(list => {
        setCalendarList(list)
    })
    return (
        <div style={{ ...defaultStyle, ...style }} {...rest}>
            <div style={{
                fontSize: "30pt",
            }}>Composite Calendar</div>
            {
                currentSettings.map((item, index) => {
                    return (
                        <Rule
                            writeableCalendarList={writeableCalendarList}
                            key={index}
                            savedSettings={item}
                            calendarList={calendarList}
                            logout={logout}
                            setSavedSettings={(newSetting) => {
                                setCurrentSettings(currentSettings.map((oldSetting, i) => {
                                    if (i === index) {
                                        return newSetting;
                                    } else {
                                        return oldSetting;
                                    }
                                }));
                            }}
                            remove={() => {
                                setCurrentSettings(currentSettings.filter((_oldSetting, i) => {
                                    return i !== index;
                                }));
                            }}
                        />
                    );
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
                    setCurrentSettings([...currentSettings, {
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
