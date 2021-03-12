import "./pages.scss";
import React, { lazy, Suspense } from "react";
import { Redirect, Switch } from "react-router";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";

let pages = {};

function backgroundLoading(name, importCall) {
	importCall.then((data) => {
		pages[name] = data.default;
	});

	pages[name] = lazy(() => importCall);
}

backgroundLoading("Account", import("./account/account"));
backgroundLoading("AddGame", import("./addGame/addGame"));
backgroundLoading("AddLocation", import("./addLocation/addLocation"));
backgroundLoading("Game", import("./game/game"));
backgroundLoading("Games", import("./games/games"));
backgroundLoading("Location", import("./location/location"));
backgroundLoading("Locations", import("./locations/locations"));
backgroundLoading("Login", import("./login/login"));
backgroundLoading("Page404", import("./page404/page404"));
backgroundLoading("User", import("./user/user"));
backgroundLoading("Users", import("./users/users"));

function PrivateRoute({ user, component: Component, conditionFn = () => true, ...routeProps }) { // eslint-disable-line react/prop-types
	return (
		<Route
			{...routeProps}
			render={(props) => {
				if (user.isAnonymous()) { // eslint-disable-line react/prop-types
					return (<Redirect
						to={{
							pathname: "/login",
							state: { from: props.location } // eslint-disable-line react/prop-types
						}}
					/>);
				}
				if (!conditionFn(user)) {
					return <pages.Page404 {...props} user={user}/>;
				}
				return <Component {...props} user={user}/>;
			}}
		/>
	);
}

export default class Pages extends React.Component {
	static defaultProps = {
		user: null
	};

	static propTypes = {
		logout: PropTypes.func.isRequired,
		setUser: PropTypes.func.isRequired,
		user: PropTypes.object.isRequired
	};

	state = {};

	renderFallback() {
		return (
			<div className="splashscreen">
				<div className="lds-ring">
					<div/>
					<div/>
					<div/>
					<div/>
				</div>
			</div>
		);
	}

	render() {
		return (
			<Suspense fallback={this.renderFallback()}>
				<Switch>
					<Route exact component={(props) => <pages.Login
						setUser={this.props.setUser}
						user={this.props.user}
						{...props}
					/>} path="/login"/>
					<Route exact component={() => "TO DO"} path="/register"/>
					<PrivateRoute exact component={pages.Games} conditionFn={(user) => user.canViewGames()} path="/" user={this.props.user}/>
					<PrivateRoute exact component={pages.Locations} conditionFn={(user) => user.canNavigateToLocations()} path="/locations" user={this.props.user}/>
					<PrivateRoute exact component={({ user, match: { params: { id } } }) => <pages.Game
						key={id}
						id={id}
						user={user}
					/>} path="/game/:id" user={this.props.user}/>
					<PrivateRoute exact component={({ user, match: { params: { id } } }) => <pages.Location
						id={id}
						user={user}
					/>} conditionFn={(user) => user.canNavigateToLocations()} path="/location/:id" user={this.props.user}/>
					<PrivateRoute exact component={pages.AddGame} conditionFn={(user) => user.canAddGames()} path="/add-game" user={this.props.user}/>
					<PrivateRoute exact component={pages.AddLocation} conditionFn={(user) => user.canAddLocations()} path="/add-location" user={this.props.user}/>
					<PrivateRoute exact component={pages.Users} conditionFn={(user) => user.canNavigateToUsers()} path="/users" user={this.props.user}/>
					<PrivateRoute exact component={(props) => <pages.Account
						logout={this.props.logout}
						setUser={this.props.setUser}
						{...props}
					/>} path="/account" user={this.props.user}/>
					<PrivateRoute exact component={({ user, match: { params: { id } } }) => <pages.User
						key={id}
						id={id}
						user={user}
					/>} conditionFn={(user) => user.canNavigateToUsers()} path="/user/:id" user={this.props.user}/>
					<Redirect from="/games" to="/"/>
					<Route render={() => <pages.Page404 user={this.props.user}/>}/>
				</Switch>
			</Suspense>
		);
	}
}
