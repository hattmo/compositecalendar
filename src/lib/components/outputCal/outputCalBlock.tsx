import React from "react";
import SelectCal from "../selectCal";
import { ICalendar } from "../../../types";

interface IProps {
    calendarList: ICalendar[];
    outputCal?: ICalendar;
    setOutputCal: (newCal: ICalendar) => void;
}
export default ({ calendarList, outputCal, setOutputCal }: IProps) => {
    return (
        <div>
            <SelectCal
                setSelectedCal={setOutputCal}
                selectedCal={outputCal}
                cals={calendarList} />
        </div>
    );
};
