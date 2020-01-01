import React from "react";
import "./loadingBar.css";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
    totalValue: number;
    progress: number;
    addStyle: boolean;
}

export default ({ addStyle, totalValue, progress, style, ...rest }: IProps) => {
    const adjustedTotalVal = totalValue !== 0 ? totalValue : 1;
    const adjustedProgress = progress < adjustedTotalVal ? progress : adjustedTotalVal;
    const precent = Math.floor((adjustedProgress / adjustedTotalVal) * 100);
    return (
        <div style={{ ...defaultStyle, ...style }} {...rest}>
            <div className={addStyle ? "loadingBarAdd" : "loadingBarDelete"} style={{
                width: `${precent}%`,
            }}></div>
        </div>
    );
};

const defaultStyle: React.CSSProperties = {
    display: "grid",
    alignItems: "fill",
    justifyItems: "start",
    height: "20px",
    border: "1px solid black",
    borderRadius: "4px",
};
