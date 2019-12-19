import React, { useState } from "react";
import SelectCal from "./selectCal";
import { ICalendar } from "../../types";
import InputCalList from "../components/inputCalList";

interface IProps {
    calendarList: ICalendar[];
    inputCals: ICalendar[];
    setInputCals: (newCals: ICalendar[]) => void;
}
export default ({ calendarList, inputCals, setInputCals }: IProps) => {
    const [selectedInputCal, setSelectedInputCal] = useState<ICalendar>();
    return (
        <div>
            <div>
                <SelectCal
                    setSelectedItem={setSelectedInputCal}
                    selectedItem={selectedInputCal}
                    items={calendarList} />
            </div>
            <button onClick={() => {
                if (selectedInputCal !== undefined) {
                    setInputCals([selectedInputCal, ...inputCals]);
                }
            }}>Add</button>
            <InputCalList inputCals={inputCals} />
        </div>
    );
};
