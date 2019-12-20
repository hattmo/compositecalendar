import React from "react";
import { ICalendar } from "../../types";
interface IProps {
    cals: ICalendar[];
    selectedCal?: ICalendar;
    setSelectedCal: (item: ICalendar) => void;
}

export default ({ cals, selectedCal, setSelectedCal }: IProps) => {
    if (selectedCal !== undefined) {
        const selectedCalId = selectedCal.id;
        return (
            <select value={selectedCalId} onChange={(e) => {
                setSelectedCal(cals.find((item) => {
                    return item.id === e.target.value;
                }) ?? cals[0]);
            }}>
                {cals.map((item, index) => {
                    return (
                        <option value={item.id} key={index}>
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
