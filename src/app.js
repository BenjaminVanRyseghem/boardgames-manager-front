import "./app.scss";

import { BrowserRouter } from "react-router-dom";
import Pages from "./pages/pages";
import React from "react";

class App extends React.Component {
	render() {
		return (
			<BrowserRouter>
				<Pages/>
			</BrowserRouter>
		);
	}
}

export default App;
