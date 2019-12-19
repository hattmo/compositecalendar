import React, { useState } from "react";
import SelectCal from "../selectCal";
import { ICalendar } from "../../../types";
import InputCalList from "./inputCalList";

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
                    setSelectedCal={setSelectedInputCal}
                    selectedCal={selectedInputCal}
                    cals={calendarList} />
            </div>
            <button onClick={() => {
                if (selectedInputCal !== undefined && !inputCals.includes(selectedInputCal)) {
                    setInputCals([selectedInputCal, ...inputCals]);
                }
            }}>Add</button>
            <InputCalList setInputCals={setInputCals} inputCals={inputCals} />
        </div>
    );
};
