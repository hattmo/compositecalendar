import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import Privacy from "./pages/privacy";
import Terms from "./pages/terms";

export default () => {

    return (
        <Router>
            <Switch>
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/privacy">
                    <Privacy />
                </Route>
                <Route path="/terms">
                    <Terms />
                </Route>
                <Route>
                    <Home />
                </Route>
            </Switch>
        </Router>
    );
};
