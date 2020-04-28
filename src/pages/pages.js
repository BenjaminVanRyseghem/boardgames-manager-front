import "./pages.scss";
import AddGame from "./addGame/addGame";
import Game from "./game/game";
import Games from "./games/games";
import globalState from "models/globalState";
import Home from "./home/home";
import Page404 from "./page404/page404";
import React from "react";
import { Route } from "react-router-dom";
import { Switch } from "react-router";

function PrivateRoute({ component: Component, conditionFn = () => true, ...routeProps }) { // eslint-disable-line react/prop-types
	return (
		<Route
			{...routeProps}
			render={(props) => (globalState.isLogged() && conditionFn(globalState.user())
				? <Component {...props} client={globalState.user()}/>
				: <Page404 {...props}/>)
			}
		/>
	);
}

export default class Pages extends React.Component {
	static defaultProps = {};

	static propTypes = {};

	state = {};

	render() {
		return (
			<>
				<Switch>
					<Route exact component={() => "TO DO"} path="/login"/>
					<Route exact component={Home} path="/"/>
					<PrivateRoute exact component={Games} path="/games"/>
					<PrivateRoute exact component={({ match: { params: { id } } }) => <Game id={id}/>} path="/game/:id"/>
					<Route exact component={() => "TO DO"} path="/register"/>
					<PrivateRoute exact component={AddGame} conditionFn={(user) => user.canAddGames()} path="/add-game"/>
					<Route component={Page404}/>
				</Switch>
			</>
		);
	}
}
