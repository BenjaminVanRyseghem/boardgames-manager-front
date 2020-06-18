import "./navigationMenu.scss";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";

export default class NavigationMenu extends React.Component {
	static defaultProps = {};

	static propTypes = {
		user: PropTypes.object.isRequired
	};

	state = {};

	render() {
		let canNavigateToUsers = this.props.user.canNavigateToUsers();

		return (
			<div className="navigationMenu">
				<NavLink exact className="link" to="/">Home</NavLink>
				<NavLink className="link" to="/games">Games</NavLink>
				<NavLink className="link" to="/locations">Locations</NavLink>
				{canNavigateToUsers && <NavLink className="link" to="/users">Users</NavLink>}
			</div>
		);
	}
}
