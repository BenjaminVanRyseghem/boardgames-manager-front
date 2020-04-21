import "bootstrap/dist/css/bootstrap.min.css";
import "../src/helpers/fontAwesome";
import "../src/index.scss";

import { addDecorator, addParameters, configure } from "@storybook/react";
import fetchMock from "fetch-mock";
import React from "react";

addParameters({
	backgrounds: [
		{ name: "white", value: "#FFFFFF", default: true },
		{ name: "twitter", value: "#00ACED" },
		{ name: "facebook", value: "#3B5998" }
	],
	options: {
		panelPosition: 'right',
		storySort: (a, b) =>
			a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, { numeric: true }),
	},
});

addDecorator((storyFn) => {
	fetchMock.restore();
	return storyFn();
});

configure(require.context('../src/', true, /\.stories\.js$/), module);
