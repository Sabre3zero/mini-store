import React from "react";
import ReactDOM from "react-dom/client";
import { getData } from "@ministore/api";

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(<div>I'm admin!</div>);
}

getData();
