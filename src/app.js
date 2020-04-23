import "./app.scss";

import { BrowserRouter } from "react-router-dom";
import { i18nPromise } from "./i18n/i18n";
import Pages from "./pages/pages";
import React from "react";

class App extends React.Component {
	state = {
		loading: true
	}

	constructor() {
		super(...arguments); // eslint-disable-line prefer-rest-params

		i18nPromise
			.then(() => {
				this.setState({ loading: false });
			});
	}

	render() {
		if (this.state.loading) {
			return null;
		}

		return (
			<BrowserRouter>
				<Pages/>
			</BrowserRouter>
		);
	}
}

export default App;
