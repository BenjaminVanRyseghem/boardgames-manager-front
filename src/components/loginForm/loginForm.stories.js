import { action } from "@storybook/addon-actions";
import LoginForm from "./loginForm";

import React from "react";

export default {
	component: LoginForm,
	title: "Components/LoginForm"
};

export const valid = () => <LoginForm onSubmit={action("submit")}/>;
export const invalid = () => <LoginForm invalid onSubmit={action("submit")}/>;
export const validLoading = () => <LoginForm loading onSubmit={action("submit")}/>;
export const invalidLoading = () => <LoginForm invalid loading onSubmit={action("submit")}/>;
