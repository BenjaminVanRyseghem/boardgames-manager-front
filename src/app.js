import "./app.scss";
import User, { anonymousUser } from "models/user";
import { BrowserRouter } from "react-router-dom";
import Cookies from "js-cookie";
import { i18nPromise } from "./i18n/i18n";
import jwt from "jsonwebtoken";
import Pages from "./pages/pages";
import React from "react";
import { roles } from "models/accessControl";
import UserKindSwitcher from "./components/userKindSwitcher/userKindSwitcher";

const cookieName = "com.boardgames-manager";

class App extends React.Component {
	constructor(...args) {
		super(...args);

		let user = anonymousUser;
		let cookie = Cookies.getJSON(cookieName);

		if (cookie) {
			user = new User(cookie.user);
		}

		if (process.env.NODE_ENV === "development") { // eslint-disable-line no-process-env
			user = new User({
				id: "benjamin.vanryseghem@cyberzen.com",
				role: roles.admin
			});
		}

		this.state = {
			loading: true,
			user
		};

		i18nPromise
			.then(() => {
				this.setState({ loading: false });
			});
	}

	setUser(user) {
		this.setState({ user }, () => {
			let payload = jwt.decode(user.token());

			// Set a cookie expiring at the same time as the token
			Cookies.set(cookieName, { user: user.toJSON() }, {
				expires: new Date(payload.exp * 1000)
			});
		});
	}

	render() {
		if (this.state.loading) {
			return null;
		}

		let canSwitchRole = process.env.NODE_ENV === "development"; // eslint-disable-line no-process-env

		return (
			<BrowserRouter>
				{canSwitchRole && <UserKindSwitcher
					setUser={(user) => this.setState({ user })}
					user={this.state.user}
				/>}
				<Pages user={this.state.user}/>
			</BrowserRouter>
		);
	}
}

export default App;
