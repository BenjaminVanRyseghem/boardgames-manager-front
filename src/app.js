import "./app.scss";
import CurrentUser, { anonymousUser } from "models/currentUser";
import { BrowserRouter } from "react-router-dom";
import Cookies from "js-cookie";
import { i18nPromise } from "./i18n/i18n";
import jwt from "jsonwebtoken";
import Pages from "./pages/pages";
import React from "react";
import { Redirect } from "react-router";
import { roles } from "models/accessControl";
import UserKindSwitcher from "./components/userKindSwitcher/userKindSwitcher";

const cookieName = "com.boardgames-manager";

class App extends React.Component {
	constructor(...args) {
		super(...args);

		let user = anonymousUser;
		let cookie = Cookies.getJSON(cookieName);

		if (cookie) {
			user = new CurrentUser(cookie.user);
		}

		if (process.env.NODE_ENV === "development1") { // eslint-disable-line no-process-env
			user = new CurrentUser({
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

	setUser(user, redirect) {
		this.setState({
			user,
			redirect
		}, () => {
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

		let canSwitchRole = process.env.NODE_ENV === "development1"; // eslint-disable-line no-process-env

		return (
			<BrowserRouter>
				{canSwitchRole && <UserKindSwitcher
					setUser={(user) => this.setState({ user })}
					user={this.state.user}
				/>}
				{this.state.redirect && <Redirect to={this.state.redirect}/>}
				<Pages
					setUser={this.setUser.bind(this)}
					user={this.state.user}
				/>
			</BrowserRouter>
		);
	}
}

export default App;
