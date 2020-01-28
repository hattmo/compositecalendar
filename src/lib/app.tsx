import React from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import Auth from "./pages/auth";
import Login from "./pages/login";
import Home from "./pages/home";
import Privacy from "./pages/privacy";
import Terms from "./pages/terms";

export default () => {

    return (
        <Router>
            <Switch>
                <Route path="/login">
                    <Login message={loginMessage} />
                </Route>
                <Route path="/privacy">
                    <Privacy/>
                </Route>
                <Route path="/terms">
                    <Terms/>
                </Route>
                <Route>
                    {accessToken !== null ?
                        (<Home accessToken={accessToken} logout={(message) => {
                            setLoginMessage(message);
                            setAccessToken(null);
                        }} />) :
                        (<Redirect to="/login" />)
                    }
                </Route>
            </Switch>
        </Router>
    );
};
