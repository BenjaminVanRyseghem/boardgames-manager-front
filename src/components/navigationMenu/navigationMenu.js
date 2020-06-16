import "./navigationMenu.scss";
import { NavLink } from "react-router-dom";
import React from "react";

export default class NavigationMenu extends React.Component {
	static defaultProps = {};

	static propTypes = {};

	state = {};

	render() {
		return (
			<div className="navigationMenu">
				<NavLink exact className="link" to="/">Home</NavLink>
				<NavLink className="link" to="/games">Games</NavLink>
				<NavLink className="link" to="/locations">Locations</NavLink>
				<NavLink className="link" to="/users">Users</NavLink>
			</div>
		);
	}
}
