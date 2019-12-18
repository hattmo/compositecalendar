import React from "react";
import { useLocation, Redirect } from "react-router-dom";

interface IProps {
    onFailedLogin: () => void;
    onSuccessfulLogin: (string) => void;
}

export default ({ onFailedLogin, onSuccessfulLogin }: IProps) => {
    const code = new URLSearchParams(useLocation().search).get("code");
    if (typeof code === "string") {
        onSuccessfulLogin(code);
        return (<Redirect to="/" />);
    } else {
        onFailedLogin();
        return (<Redirect to="/" />);
    }
};
