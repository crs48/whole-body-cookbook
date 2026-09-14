import { StrictMode, createElement } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";

const el = document.getElementById("app");
if (!el) throw new Error("#app missing");
createRoot(el).render(createElement(StrictMode, null, createElement(App)));
