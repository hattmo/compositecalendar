import React from "react";
import ReactDom from "react-dom";
import Index from "./lib/app";
import "./index.html";
import "./favicon.ico";

const root = document.createElement("div");
document.body.appendChild(root);

ReactDom.render(
  (<Index />),
  root,
);
