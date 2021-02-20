import "./gamePreview.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import React from "react";

export default class GamePreview extends React.Component {
	static defaultProps = {};

	static propTypes = {
		data: PropTypes.object.isRequired,
		query: PropTypes.string.isRequired
	};

	state = {};

	typeToIcon(type) {
		switch (type) {
			case "rpgitem":
				return "dice-d20";
			case "videogame":
				return "gamepad";
			case "boardgameaccessory":
				return "chess-knight";
			case "boardgameexpansion":
				return "puzzle-piece";
			case "boardgame":
			default:
				return "chess";
		}
	}

	renderType() {
		if (!this.props.data.type) {
			return null;
		}

		let icon = this.typeToIcon(this.props.data.type);

		if (!this.props.data.page) {
			return (
				<div className="type">
					<FontAwesomeIcon icon={icon}/>
				</div>
			);
		}

		return (
			<div className="type">
				<a href={this.props.data.page} rel="noopener noreferrer" target="_blank">
					<FontAwesomeIcon icon={icon}/>
				</a>
			</div>
		);
	}

	renderName() {
		let regexp = new RegExp(this.props.query, "ig");

		let result = this.props.data.name;

		let match = regexp.exec(this.props.data.name);

		if (match) {
			result = <>
				{this.props.data.name.slice(0, match.index)}
				<span className="match">{match[0]}</span>
				{this.props.data.name.slice(match.index + this.props.query.length)}
			</>;
		}

		return (
			<div className="name">{result}{this.renderYearOfPublication()}</div>
		);
	}

	renderYearOfPublication() {
		if (!this.props.data.yearpublished) {
			return null;
		}
		return (
			<span className="yearOfPublication">({this.props.data.yearpublished})</span>
		);
	}

	render() {
		return (
			<div className="gamePreview">
				{this.renderType()}
				{this.renderName()}
			</div>
		);
	}
}
