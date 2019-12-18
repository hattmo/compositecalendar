import React from "react";

interface IProps {
    logoutClicked: () => void;
}

export default ({ logoutClicked }: IProps) => {
    return (
        <div>

            <h1>IM HOME</h1>
            <button onClick={() => { logoutClicked() }}>logout</button>
        </div>
    );
};
