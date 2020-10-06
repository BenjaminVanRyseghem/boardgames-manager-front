import "./navigationMenu.scss";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";
import Translate from "../i18n/translate";

export default class NavigationMenu extends React.Component {
	static defaultProps = {};

	static propTypes = {
		user: PropTypes.object.isRequired
	};

	state = {};

	render() {
		let canNavigateToLocations = this.props.user.canNavigateToLocations();
		let canNavigateToUsers = this.props.user.canNavigateToUsers();

		return (
			<div className="navigationMenu">
				<NavLink exact className="link" to="/"><Translate i18nKey="games">Games</Translate></NavLink>
				{canNavigateToLocations && <NavLink className="link" to="/locations"><Translate i18nKey="locations">Locations</Translate></NavLink>}
				{canNavigateToUsers && <NavLink className="link" to="/users"><Translate i18nKey="users">Users</Translate></NavLink>}
			</div>
		);
	}
}
