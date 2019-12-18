import React from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import { useLocalStorage } from "web-api-hooks";
import Auth from "./pages/auth";
import Login from "./pages/login";
import Home from "./pages/home";

export default () => {
    const [accessKey] = useLocalStorage<string>("accessKey", null);
    let routes;
    if (accessKey === null) {
        routes = (
            <Switch>
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/auth">
                    <Auth />
                </Route>
                <Route>
                    <Redirect to="/login" />
                </Route>
            </Switch>
        )
    } else {
        routes = (
            <Route path="/" >
                <Home />
            </Route>
        );
    }
    return (
        <Router>
            {routes}
        </Router>
    );


};
