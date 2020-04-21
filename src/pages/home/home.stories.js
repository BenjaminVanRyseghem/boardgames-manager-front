import Home from "./home";
import { MemoryRouter } from "react-router";
import React from "react";
import { storiesOf } from "@storybook/react";

storiesOf("Pages/Home", module)
	.addDecorator((storyFn) => <MemoryRouter>{storyFn()}</MemoryRouter>)
	.add("shows", () => <Home/>);
