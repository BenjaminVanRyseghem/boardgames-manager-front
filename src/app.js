import "./app.scss";
import CurrentUser, { anonymousUser } from "models/currentUser";
import { BrowserRouter } from "react-router-dom";
import Cookies from "js-cookie";
import fetcher from "./helpers/fetcher";
import { i18nPromise } from "./i18n/i18n";
import jwt from "jsonwebtoken";
import Pages from "./pages/pages";
import React from "react";
import { Redirect } from "react-router";
import UserKindSwitcher from "./components/userKindSwitcher/userKindSwitcher";

const cookieName = "com.boardgames-manager";

class App extends React.Component {
	constructor(...args) {
		super(...args);

		let user = anonymousUser;
		let cookie = Cookies.getJSON(cookieName);

		if (cookie) {
			user = new CurrentUser(cookie.user);

			this.fetchUser(user)
				.then((data) => {
					let finalData = Object.assign({}, cookie.user, data);
					let newUser = new CurrentUser(finalData);
					this.setUser(newUser, null);
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

	fetchUser(currentUser) {
		let init = {};
		init.credentials = init.credentials || "same-origin";
		init.headers = init.headers || {};
		init.headers.Accept = init.headers.Accept || "application/json";
		init.headers["Content-Type"] = init.headers["Content-Type"] || "application/json";

		if (currentUser && !currentUser.isAnonymous()) {
			init.headers.Authorization = `Bearer ${currentUser.token()}`;
		}

		return fetcher(`/api/v1/user/${currentUser.id()}`, init);
	}

	setUser(user, redirect = "/") {
		this.setState({
			user,
			redirect
		}, () => {
			let payload = jwt.decode(user.token());

			// Set a cookie expiring at the same time as the token
			Cookies.set(cookieName, { user: user.toJSON() }, {
				sameSite: "lax",
				expires: new Date(payload.exp * 1000)
			});
		});
	}

	logout() {
		Cookies.remove(cookieName);
		this.setState({
			user: anonymousUser,
			redirect: "/"
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
					logout={this.logout.bind(this)}
					setUser={this.setUser.bind(this)}
					user={this.state.user}
				/>
			</BrowserRouter>
		);
	}
}

export default App;
