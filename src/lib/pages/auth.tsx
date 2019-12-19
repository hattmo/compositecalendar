import React from "react";
import { useLocation, Redirect } from "react-router-dom";
import queryString = require("query-string");

interface IProps {
    onFailedLogin: () => void;
    onSuccessfulLogin: (accessToken: string) => void;
}

export default ({ onFailedLogin, onSuccessfulLogin }: IProps) => {
    const token = queryString.parse(useLocation().hash).access_token as string;
    if (token !== undefined) {
        onSuccessfulLogin(token);
        return (<Redirect to="/" />);
    } else {
        onFailedLogin();
        return (<Redirect to="/" />);
    }
};
