import "./pages.scss";
import { Redirect, Switch } from "react-router";
import Account from "./account/account";
import AddGame from "./addGame/addGame";
import AddLocation from "./addLocation/addLocation";
import Game from "./game/game";
import Games from "./games/games";
import Location from "./location/location";
import Locations from "./locations/locations";
import Login from "./login/login";
import Page404 from "./page404/page404";
import PropTypes from "prop-types";
import React from "react";
import { Route } from "react-router-dom";
import User from "./user/user";
import Users from "./users/users";

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
					return <Page404 {...props} user={user}/>;
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

	render() {
		return (
			<>
				<Switch>
					<Route exact component={(props) => <Login setUser={this.props.setUser} user={this.props.user} {...props}/>} path="/login"/>
					<Route exact component={() => "TO DO"} path="/register"/>
					<PrivateRoute exact component={Games} conditionFn={(user) => user.canViewGames()} path="/" user={this.props.user}/>
					<PrivateRoute exact component={Locations} conditionFn={(user) => user.canNavigateToLocations()} path="/locations" user={this.props.user}/>
					<PrivateRoute exact component={({ user, match: { params: { id } } }) => <Game
						key={id}
						id={id}
						user={user}
					/>} path="/game/:id" user={this.props.user}/>
					<PrivateRoute exact component={({ user, match: { params: { id } } }) => <Location
						id={id}
						user={user}
					/>} conditionFn={(user) => user.canNavigateToLocations()} path="/location/:id" user={this.props.user}/>
					<PrivateRoute exact component={AddGame} conditionFn={(user) => user.canAddGames()} path="/add-game" user={this.props.user}/>
					<PrivateRoute exact component={AddLocation} conditionFn={(user) => user.canAddLocations()} path="/add-location" user={this.props.user}/>
					<PrivateRoute exact component={Users} conditionFn={(user) => user.canNavigateToUsers()} path="/users" user={this.props.user}/>
					<PrivateRoute exact component={(props) => <Account logout={this.props.logout} setUser={this.props.setUser} {...props}/>} path="/account" user={this.props.user}/>
					<PrivateRoute exact component={({ user, match: { params: { id } } }) => <User
						key={id}
						id={id}
						user={user}
					/>} conditionFn={(user) => user.canNavigateToUsers()} path="/user/:id" user={this.props.user}/>
					<Redirect from="/games" to="/"/>
					<Route render={() => <Page404 user={this.props.user}/>}/>
				</Switch>
			</>
		);
	}
}
