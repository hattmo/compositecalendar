import React from "react";

interface IProps {
    validRegex: boolean;
    startDate: string;
    setStartDate: (string) => void;
    endDate: string;
    setEndDate: (string) => void;
    regex: string;
    setRegex: (string) => void;
}

export default ({ validRegex, startDate, setStartDate, endDate, setEndDate, regex, setRegex }: IProps) => {

    return (
        <div>
            <input type="date" value={startDate} onChange={(e) => { setStartDate(e.currentTarget.value); }} />
            <input type="date" value={endDate} onChange={(e) => { setEndDate(e.currentTarget.value); }} />
            <input style={{ backgroundColor: validRegex ? "" : "red" }} type="text"
                value={regex} onChange={(e) => { setRegex(e.currentTarget.value); }} />
        </div>
    );
};
