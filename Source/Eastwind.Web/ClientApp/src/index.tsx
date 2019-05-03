import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.js";
import "../node_modules/jquery/src/jquery";
import "./index.css";
import App from "./components/App";

render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
