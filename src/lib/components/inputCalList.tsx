import React from "react";
import { ICalendar } from "../../types";

interface IProps {
    inputCals: ICalendar[];
    setInputCals: (newInput)
}

export default ({ inputCals }: IProps) => {
    return (
        <div>
            {inputCals.map((item, index) => {
                return (
                    <div key={index}>
                        {item.name}
                        <span onClick={() => {}}> X</span>
                    </div>
                );
            })}
        </div>
    );
};
