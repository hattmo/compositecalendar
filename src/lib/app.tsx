import React, { useState } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import { useLocalStorage } from "web-api-hooks";
import Auth from "./pages/auth";
import Login from "./pages/login";
import Home from "./pages/home";

export default () => {
    const [accessKey, setAccessKey] = useLocalStorage<string | null>("accessKey", null);
    const [failedLogin, setFailedLogin] = useState(false);
    let routes;
    if (accessKey === null) {
        routes = (
            <Switch>
                <Route path="/login">
                    <Login isFailedLogin={failedLogin} />
                </Route>
                <Route path="/auth">
                    <Auth onFailedLogin={() => { setFailedLogin(true); }}
                        onSuccessfulLogin={setAccessKey} />
                </Route>
                <Route>
                    <Redirect to="/login" />
                </Route>
            </Switch>
        )
    } else {
        routes = (
            <Route path="/" >
                <Home logoutClicked={() => { setAccessKey(null); }} />
            </Route>
        );
    }
    return (
        <Router>
            {routes}
        </Router>
    );


};
