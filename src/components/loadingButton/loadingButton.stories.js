import { action } from "@storybook/addon-actions";
import LoadingButton from "./loadingButton";

import React from "react";
import { storiesOf } from "@storybook/react";

storiesOf("Components/LoadingButton", module)
	.add("shows", () => <LoadingButton color="dark" onClick={action("on click")}>Submit</LoadingButton>)
	.add("loading", () => <LoadingButton loading color="dark" onClick={action("on click")}>Submit</LoadingButton>);
