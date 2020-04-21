import { MemoryRouter } from "react-router";
import Menu from "./menu";
import React from "react";

export default {
	component: Menu,
	title: "Components/Menu",
	decorators: [(storyFn) => <MemoryRouter>{storyFn()}</MemoryRouter>]
};

export const shows = () => <Menu/>;
