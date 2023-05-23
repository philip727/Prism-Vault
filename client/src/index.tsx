/* @refresh reload */
import { render } from "solid-js/web";

import "./_colours.scss"
import "./_index.css";
import App from "./App";

render(() => <App />, document.getElementById("root") as HTMLElement);
