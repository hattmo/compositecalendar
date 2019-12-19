import React from "react";
import { ICalendar } from "../../types";
interface IProps {
    cals: ICalendar[];
    selectedCal?: ICalendar;
    setSelectedCal: (item: ICalendar) => void;
}

export default ({ cals, selectedCal, setSelectedCal }: IProps) => {
    if (selectedCal !== undefined) {
        return (
            <select value={cals.indexOf(selectedCal)} onChange={(e) => { setSelectedCal(cals[e.target.value]); }}>
                {cals.map((item, index) => {
                    return (
                        <option value={index} key={index}>
                            {item.name}
                        </option>
                    );
                })}
            </select>
        );
    } else if (cals.length > 0) {
        setSelectedCal(cals[0]);
    }
    return (
        <select>
            <option>Loading Calendars...</option>
        </select>
    );
};
