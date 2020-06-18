import "./pages.scss";
import AddGame from "./addGame/addGame";
import Game from "./game/game";
import Games from "./games/games";
import Home from "./home/home";
import Location from "./location/location";
import Locations from "./locations/locations";
import Page404 from "./page404/page404";
import PropTypes from "prop-types";
import React from "react";
import { Route } from "react-router-dom";
import { Switch } from "react-router";
import Users from "./users/users";

function PrivateRoute({ user, component: Component, conditionFn = () => true, ...routeProps }) { // eslint-disable-line react/prop-types
	return (
		<Route
			{...routeProps}
			render={(props) => (user && conditionFn(user)
				? <Component {...props} user={user}/>
				: <Page404 {...props} user={user}/>)
			}
		/>
	);
}

export default class Pages extends React.Component {
	static defaultProps = {
		user: null
	};

	static propTypes = {
		user: PropTypes.object
	};

	state = {};

	render() {
		return (
			<>
				<Switch>
					<Route exact component={() => "TO DO"} path="/login"/>
					<Route exact component={Home} path="/"/>
					<Route exact component={() => "TO DO"} path="/register"/>
					<PrivateRoute exact component={Games} path="/games" user={this.props.user}/>
					<PrivateRoute exact component={Locations} path="/locations" user={this.props.user}/>
					<PrivateRoute exact component={({ user, match: { params: { id } } }) => <Game
						id={id}
						user={user}
					/>} path="/game/:id" user={this.props.user}/>
					<PrivateRoute exact component={({ user, match: { params: { id } } }) => <Location
						id={id}
						user={user}
					/>} path="/location/:id" user={this.props.user}/>
					<PrivateRoute exact component={AddGame} conditionFn={(user) => user.canAddGames()} path="/add-game" user={this.props.user}/>
					<PrivateRoute exact component={Users} conditionFn={(user) => user.canNavigateToUsers()} path="/users" user={this.props.user}/>
					<Route render={() => <Page404 user={this.props.user}/>}/>
				</Switch>
			</>
		);
	}
}
