import React from "react";
import { useLocation } from "react-router-dom";

export default () => {
    const code = new URLSearchParams(useLocation().search).get("code");
    return (
        typeof code === "string" ? (

        ): (

            )
    );
};
