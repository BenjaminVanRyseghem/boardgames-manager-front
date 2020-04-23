import "core-js";
import "whatwg-fetch";
import "bootstrap/dist/css/bootstrap.min.css";
import "./helpers/fontAwesome";
import "sweetalert2/src/sweetalert2.scss";
import "./index.scss";
import "moment/locale/fr";
import "./i18n/i18n";
import * as serviceWorker from "./serviceWorker";
import App from "./app";
import moment from "moment";
import React from "react";
import ReactDOM from "react-dom";

moment.locale("fr");

ReactDOM.render(
	<App/>,
	document.getElementById("root")
);

/*
 * If you want your app to work offline and load faster, you can change
 * unregister() to register() below. Note this comes with some pitfalls.
 * Learn more about service workers: https://bit.ly/CRA-PWA
 */
serviceWorker.unregister();
