import { render } from "solid-js/web";
import { App } from "./app/App";
import "reflect-metadata";
import "./index.css";
import "./shared/ui/styles";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
        "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
    );
}

const dispose = render(() => <App />, root!);
if (import.meta.hot) import.meta.hot.dispose(() => dispose());

