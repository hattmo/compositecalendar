import React from "react";
import ReactDom from "react-dom";
import Index from "./lib/app";
import "./index.html";
import "./favicon.ico";
import "./default.css";

const root = document.createElement("div");
root.style.height = "100%";
document.body.appendChild(root);

ReactDom.render(
  (<Index />),
  root,
);
