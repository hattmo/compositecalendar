import React from "react";
import { ICalendar } from "../../types";
interface IProps {
    items: ICalendar[];
    selectedItem?: ICalendar;
    setSelectedItem: (item: ICalendar) => void;
}

export default ({ items, selectedItem, setSelectedItem }: IProps) => {
    if (selectedItem !== undefined) {
        return (
            <select value={items.indexOf(selectedItem)} onChange={(e) => { setSelectedItem(items[e.target.value]); }}>
                {items.map((item, index) => {
                    return (
                        <option value={index} key={index}>
                            {item.name}
                        </option>
                    );
                })}
            </select>
        );
    } else if (items.length > 0) {
        setSelectedItem(items[0]);
    }
    return (
        <select>
            <option>Loading Calendars...</option>
        </select>
    );
};
