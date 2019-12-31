import React, { useMemo } from "react";
import InputCalBlock from "./inputCal/inputCalBlock";
import { ICalendar, ISetting } from "../../types";
import FilterBlock from "./filter/filterBlock";
import SelectCal from "./selectCal";
import { getFilteredEvents, removeEventsFromOutput, addEventsToOutput } from "../helpers/calendarApis";
interface IProps extends React.HTMLAttributes<HTMLDivElement> {
    calendarList: ICalendar[];
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
            <FilterBlock style={{ gridArea: "date" }} startDate={startDate} endDate={endDate}
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
                <button onClick={async () => {
                    if (inputItems.length === 0) {
                        console.log("Please select one or more input calendars");
                        return;
                    } else if (startDate === "" || endDate === "") {
                        console.log("Please select a start and end date");
                        return;
                    } else if (outputCal === undefined) {
                        console.log("Please select an output calendar");
                        return;
                    }
                    try {
                        const filteredEvents = await getFilteredEvents(inputItems, startDate, endDate, accessToken);
                        await removeEventsFromOutput(outputCal, startDate, endDate, accessToken);
                        await addEventsToOutput(outputCal, filteredEvents, accessToken);
                        console.log("Done");
                    } catch (e) {
                        if (e.message === "Invalid Date") {
                            console.log("Please select a start and end date");
                            return;
                        } else if (e.message === "Unauthorized Token") {
                            logout("Token Expired");
                            return;
                        }
                    }
                }}>Build</button>
                <div onClick={remove}>🗑️</div>
            </div>
        </div >
    );
};

const defaultStyle: React.CSSProperties = {
    display: "grid",
    gap: "4px",
    gridTemplateAreas: `"inputT dateT outputT"
                        "input  date  output"
                        "buttons  buttons buttons"`,
    gridTemplateColumns: "min-content min-content min-content",
    padding: "4px",
    border: "1px solid black",
    borderRadius: "5px",
    backgroundColor: "lavender",
};
