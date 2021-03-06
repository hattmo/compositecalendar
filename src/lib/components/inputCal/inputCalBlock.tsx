import React, { useState } from "react";
import SelectCal from "../selectCal";
import { ICalendar, IInputItem } from "../../../types";
import InputCalList from "./inputCalList";
import addIcon from "../../../assets/add.png";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
    calendarList: ICalendar[];
    inputItems: IInputItem[];
    setInputItems: (newItems: IInputItem[]) => void;
}
export default ({ calendarList, inputItems, setInputItems, style, ...rest }: IProps) => {
    const [selectedInputCal, setSelectedInputCal] = useState<ICalendar>();
    return (
        <div style={{ ...defaultStyle, ...style }} {...rest}>
            <SelectCal
                style={{ gridArea: "input" }}
                setSelectedCal={setSelectedInputCal}
                selectedCal={selectedInputCal}
                cals={calendarList} />
            <div style={{
                cursor: "pointer",
                gridArea: "add",
            }} onClick={() => {
                if (selectedInputCal !== undefined &&
                    inputItems
                        .map((item) => item.cal)
                        .findIndex((item) => item.id === selectedInputCal.id) === -1) {
                    setInputItems([{
                        cal: selectedInputCal,
                        exclude: false,
                        regex: "",
                    }, ...inputItems]);
                }
            }}><img style={{ width: "20px" }} src={addIcon} /></div>
            <InputCalList style={{ gridArea: "items" }} inputItems={inputItems} setInputItems={setInputItems} />
        </div >
    );
};

const defaultStyle: React.CSSProperties = {
    display: "grid",
    gap: "4px",
    gridTemplateColumns: "400px min-content",
    gridTemplateAreas: `"input add"
                        "items items"`,
};
