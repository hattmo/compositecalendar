import React, { useState } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import { useLocalStorage } from "web-api-hooks";
import Auth from "./pages/auth";
import Login from "./pages/login";
import Home from "./pages/home";

export default () => {
    const [accessToken, setAccessToken] = useLocalStorage<string | null>("accessToken", null);
    const [loginMessage, setLoginMessage] = useState("");
    let routes;
    if (accessToken === null) {
        routes = (
            <Switch>
                <Route path="/login">
                    <Login message={loginMessage} />
                </Route>
                <Route path="/auth">
                    <Auth onFailedLogin={() => { setLoginMessage("Failed to Login"); }}
                        onSuccessfulLogin={setAccessToken} />
                </Route>
                <Route>
                    <Redirect to="/login" />
                </Route>
            </Switch>
        );
    } else {
        routes = (
            <Route >
                <Home accessToken={accessToken} logout={(message) => {
                    setLoginMessage(message);
                    setAccessToken(null);
                }} />
            </Route>
        );
    }
    return (
        <Router>
            {routes}
        </Router>
    );
};
