import React from "react";
import { ICalendar } from "../../types";
interface IProps extends React.HTMLAttributes<HTMLSelectElement> {
    cals: ICalendar[];
    selectedCal?: ICalendar;
    setSelectedCal: (item: ICalendar) => void;
}

export default ({ cals, selectedCal, setSelectedCal, ...rest }: IProps) => {
    if (cals.length !== 0) {
        if (selectedCal === undefined) {
            setSelectedCal(cals[0]);
        }
        const selectedCalId = selectedCal?.id ?? cals[0].id;
        return (
            <select value={selectedCalId} onChange={(e) => {
                setSelectedCal(cals.find((item) => {
                    return item.id === e.target.value;
                }) ?? cals[0]);
            }} {...rest}>
                {cals.map((item, index) => {
                    return (
                        <option value={item.id} key={index}>
                            {item.name}
                        </option>
                    );
                })}
            </select>
        );
    } else {
        return (
            <select>
                <option>Loading Calendars...</option>
            </select>
        );
    }
};
