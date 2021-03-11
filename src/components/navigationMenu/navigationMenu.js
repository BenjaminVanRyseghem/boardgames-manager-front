import "./navigationMenu.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";
import Translate from "../i18n/translate";

export default class NavigationMenu extends React.Component {
	static defaultProps = {};

	static propTypes = {
		onRandom: PropTypes.func.isRequired,
		user: PropTypes.object.isRequired
	};

	state = {};

	renderAccount() {
		return (
			<div className="account">
				<div className="name large-only">{this.props.user.fullName()}</div>
				<FontAwesomeIcon className="icon small-only" icon="user-tie"/>
			</div>
		);
	}

	render() {
		let canNavigateToLocations = this.props.user?.canNavigateToLocations();
		let canNavigateToUsers = this.props.user?.canNavigateToUsers();

		return (
			<div className="navigationMenu">
				<div className="group left">
					<NavLink exact className="link" to="/"><FontAwesomeIcon className="icon small-only" icon="chess"/><span className="large-only"><Translate i18nKey="games">Games</Translate></span></NavLink>
					{canNavigateToLocations &&
					<NavLink className="link" to="/locations"><FontAwesomeIcon className="icon small-only" icon="map-marker-alt"/><span className="large-only"><Translate i18nKey="locations">Locations</Translate></span></NavLink>}
					{canNavigateToUsers &&
					<NavLink className="link" to="/users"><FontAwesomeIcon className="icon small-only" icon="users"/><span className="large-only"><Translate i18nKey="users">Users</Translate></span></NavLink>}
				</div>
				<div className="group right">
					<div className="link random" onClick={this.props.onRandom}><FontAwesomeIcon className="icon small-only" icon="random"/><span className="large-only"><Translate i18nKey="random">Random</Translate></span></div>
					<NavLink exact className="link account" to="/account">{this.renderAccount()}</NavLink>
				</div>
			</div>
		);
	}
}
