import React from "react";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
    startDate: string;
    setStartDate: (string) => void;
    endDate: string;
    setEndDate: (string) => void;
}

export default ({ startDate, setStartDate, endDate, setEndDate, ...rest }: IProps) => {

    return (
        <div {...rest}>
            <input type="date" value={startDate} onChange={(e) => { setStartDate(e.currentTarget.value); }} />
            <input type="date" value={endDate} onChange={(e) => { setEndDate(e.currentTarget.value); }} />
        </div>
    );
};
