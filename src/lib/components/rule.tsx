import React, { useMemo, useState } from "react";
import InputCalBlock from "./inputCal/inputCalBlock";
import { ICalendar, ISetting } from "../../types";
import DateBlock from "./date/dateBlock";
import SelectCal from "./selectCal";
import ModalPopup from "./modalPopup/modalPopup";
import trash from "../../assets/trash.png";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
    calendarList: ICalendar[];
    writeableCalendarList: ICalendar[];
    accessToken: string;
    logout: (message: string) => void;
    savedSettings: ISetting;
    setSavedSettings: (newSettings: ISetting) => void;
    remove: () => void;
}

export default ({
    calendarList,
    accessToken,
    logout,
    savedSettings,
    setSavedSettings,
    remove,
    style,
    ...rest
}: IProps) => {
    const [modalMessage, setModalMessage] = useState("");
    const { inputItems, outputCal, startDate, endDate } = savedSettings;
    const writableCalendars = useMemo(() => {
        return calendarList.filter((item) => {
            return (item.accessRole === "writer" || item.accessRole === "owner");
        });
    }, [calendarList]);
    const upDateSave = (field: string) => {
        return ((value) => {
            setSavedSettings({
                ...savedSettings,
                [field]: value,
            });
        });
    };
    return (
        <div style={{ ...defaultStyle, ...style }} {...rest}>
            <div style={{ gridArea: "inputT", placeSelf: "center" }}>Input Calendars</div>
            <div style={{ gridArea: "dateT", placeSelf: "center" }}>Date Range</div>
            <div style={{ gridArea: "outputT", placeSelf: "center" }}>Output Calendar</div>
            <InputCalBlock style={{
                placeSelf: "start",
                gridArea: "input",
            }} calendarList={calendarList}
                inputItems={inputItems} setInputItems={upDateSave("inputItems")} />
            <DateBlock style={{ gridArea: "date" }} startDate={startDate} endDate={endDate}
                setStartDate={upDateSave("startDate")} setEndDate={upDateSave("endDate")} />
            <SelectCal style={{
                alignSelf: "start",
                gridArea: "output",
            }} cals={writableCalendars}
                selectedCal={outputCal} setSelectedCal={upDateSave("outputCal")} />
            <div style={{
                display: "grid",
                gridTemplateColumns: "auto min-content",
                gridArea: "buttons",
            }}>
                <div style={buildButtonStyle} onClick={() => { console.log("save clicked")}}>Save</div>
                <div style={{ cursor: "pointer" }} onClick={remove}><img style={{ width: "20px" }} src={trash} /></div>
            </div>
            {modalMessage !== "" ? <ModalPopup
                message={modalMessage}
                closeModal={() => { setModalMessage(""); }} /> : null}
        </div >
    );
};

const defaultStyle: React.CSSProperties = {
    display: "grid",
    gap: "4px",
    gridTemplateAreas: `"inputT   dateT   outputT"
                        "input    date    output"
                        "buttons  buttons buttons"`,
    gridTemplateColumns: "min-content min-content min-content",
    padding: "4px",
    border: "1px solid black",
    borderRadius: "5px",
    backgroundColor: "lavender",
};

const buildButtonStyle: React.CSSProperties = {
    height: "20px",
    border: "1px solid black",
    justifySelf: "stretch",
    padding: "2px",
    borderRadius: "5px",
    textAlign: "center",
    backgroundColor: "lavender",
    cursor: "pointer",
};
