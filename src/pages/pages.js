import "./pages.scss";
import { Redirect, Switch } from "react-router";
import AddGame from "./addGame/addGame";
import globalState from "models/globalState";
import Home from "./home/home";
import Page404 from "./page404/page404";
import React from "react";
import { Route } from "react-router-dom";

function PrivateRoute({ component: Component, ...routeProps }) { // eslint-disable-line react/prop-types
	return (
		<Route
			{...routeProps}
			render={(props) => (globalState.isLogged()
				? <Component {...props} client={globalState.user()}/>
				: <Redirect
					to={{
						pathname: "/login",
						state: { from: props.location } // eslint-disable-line react/prop-types
					}}
				/>)
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
					<PrivateRoute exact component={Home} path="/"/>
					<Route exact component={() => "TO DO"} path="/register"/>
					<Route exact component={AddGame} path="/Add"/>
					<Route component={Page404}/>
				</Switch>
			</>
		);
	}
}
