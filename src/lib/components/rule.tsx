import React, { useMemo, useState } from "react";
import InputCalBlock from "./inputCal/inputCalBlock";
import { ICalendar, ISetting } from "../../types";
import FilterBlock from "./date/dateBlock";
import SelectCal from "./selectCal";
import { getFilteredEvents, removeEventsFromOutput, addEventsToOutput } from "../helpers/calendarApis";
import LoadingBar from "./loadingBar/loadingBar";
import ModalPopup from "./modalPopup/modalPopup";
import trash from "../../assets/trash.png";
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
    const [loading, setLoading] = useState(false);
    const [adding, setAdding] = useState(false);
    const [progress, setProgress] = useState(0);
    const [totalValue, setTotalValue] = useState(100);
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
                {
                    !loading ? <div style={buildButtonStyle} onClick={async () => {
                        if (inputItems.length === 0) {
                            setModalMessage("Please select one or more input calendars");
                            return;
                        } else if (startDate === "" || endDate === "") {
                            setModalMessage("Please select a start and end date");
                            return;
                        } else if (outputCal === undefined) {
                            setModalMessage("Please select an output calendar");
                            return;
                        }
                        try {
                            setLoading(true);
                            setAdding(false);
                            setProgress(0);
                            await removeEventsFromOutput(outputCal, startDate, endDate, accessToken,
                                (prog, totalVal) => {
                                    setProgress(prog);
                                    setTotalValue(totalVal);
                                });
                            setAdding(true);
                            setProgress(0);
                            const filteredEvents = await getFilteredEvents(inputItems, startDate, endDate, accessToken);
                            await addEventsToOutput(outputCal, filteredEvents, accessToken,
                                (prog, totalVal) => {
                                    setProgress(prog);
                                    setTotalValue(totalVal);
                                });
                            setLoading(false);
                            setModalMessage("Build Complete");
                        } catch (e) {
                            setLoading(false);
                            if (e.message === "Invalid Date") {
                                setModalMessage("Please select a start and end date");
                                return;
                            } else if (e.message === "Unauthorized Token") {
                                logout("Token Expired");
                                return;
                            }
                        }
                    }}>Build</div> :
                        <LoadingBar addStyle={adding} totalValue={totalValue} progress={progress} />
                }
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
