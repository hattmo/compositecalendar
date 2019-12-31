import React from "react";
import { IInputItem } from "../../../types";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
    inputItems: IInputItem[];
    setInputItems: (newInput: IInputItem[]) => void;
}

export default ({ inputItems, setInputItems, ...rest }: IProps) => {
    return (
        <div {...rest}>
            {inputItems.map((item, index) => {
                return (
                    <div style={itemStyle} key={index}>
                        <div style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}>
                            {item.cal.name}
                        </div>
                        <input type="checkbox" checked={item.exclude} onChange={() => {
                            setInputItems(updateExclude(inputItems, index));
                        }} />
                        <input type="text" value={item.regex} onChange={(e) => {
                            setInputItems(updateRegex(e, inputItems, index));
                        }} />
                        <span onClick={() => { setInputItems(inputItems.filter((_item, i) => i !== index)); }}> X</span>
                    </div>
                );
            })}
        </div>
    );
};

const updateExclude = (
    inputItems: IInputItem[],
    matchindex: number,
): IInputItem[] => {
    return inputItems.map((item, index) => {
        if (index === matchindex) {
            return {
                ...item,
                exclude: !item.exclude,
            };
        } else {
            return item;
        }
    });
};

const updateRegex = (
    e: React.ChangeEvent<HTMLInputElement>,
    inputItems: IInputItem[],
    matchindex: number,
): IInputItem[] => {
    const newRegex = e.currentTarget.value;
    return inputItems.map((item, index) => {
        if (index === matchindex) {
            return {
                ...item,
                regex: newRegex,
            };
        } else {
            return item;
        }
    });
};

const itemStyle: React.CSSProperties = {
    display: "grid",
    border: "2px solid black",
    gridTemplateColumns: "1fr min-content 1fr min-content",
    placeItems: "center",
};
