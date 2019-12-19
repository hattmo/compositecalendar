import React from "react";
import { ICalendar } from "../../../types";

interface IProps {
    inputCals: ICalendar[];
    setInputCals: (newInput: ICalendar[]) => void;
}

export default ({ inputCals, setInputCals }: IProps) => {
    return (
        <div>
            {inputCals.map((item, index) => {
                return (
                    <div key={index}>
                        {item.name}
                        <span onClick={() => { setInputCals(inputCals.filter((_item, i) => i !== index)); }}> X</span>
                    </div>
                );
            })}
        </div>
    );
};
