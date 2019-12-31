import React, { useState } from "react";
import SelectCal from "../selectCal";
import { ICalendar, IInputItem } from "../../../types";
import InputCalList from "./inputCalList";

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
            <button style={{ gridArea: "add" }} onClick={() => {
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
            }}>Add</button>
            <InputCalList style={{ gridArea: "items" }} inputItems={inputItems} setInputItems={setInputItems} />
        </div >
    );
};

const defaultStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateAreas: `"input add"
                        "items items"`,
};
