import Games from "./games";
import { MemoryRouter } from "react-router";
import React from "react";
import { storiesOf } from "@storybook/react";

storiesOf("Pages/Games", module)
	.addDecorator((storyFn) => <MemoryRouter>{storyFn()}</MemoryRouter>)
	.add("shows", () => <Games location={{}}/>);
