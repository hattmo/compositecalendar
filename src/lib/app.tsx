import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import Privacy from "./pages/privacy";
import Terms from "./pages/terms";
import Console from "./pages/console";

export default () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    useEffect(() => {
        fetch("/api/session")
            .then(res => res.json())
            .then(body => {
                if (!body.loggedin) {
                    setIsLoggedIn(false);
                }
            })
    }, [])
    return (
        <Router>
            <Switch>
                <Route path="/pages/login">
                    <Login />
                </Route>
                <Route path="/pages/privacy">
                    <Privacy />
                </Route>
                <Route path="/pages/terms">
                    <Terms />
                </Route>
                <Route path="/pages/console">
                    {
                        isLoggedIn ?
                            <Console logout={(_message) => { setIsLoggedIn(false) }} /> :
                            <Redirect to="/" />
                    }
                </Route>
                <Route>
                    <Home />
                    <div>{isLoggedIn ? "logged in" : "not logged in"}</div>
                </Route>
            </Switch>
        </Router>
    );
};
