import "./gameCard.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";
import Translate from "../i18n/translate";

export default class GameCard extends React.Component {
	static defaultProps = {};

	static propTypes = {
		game: PropTypes.object.isRequired
	};

	state = {};

	renderInfo(rawIcon, text, { shouldRender = true, className = "" } = {}) {
		let icon = rawIcon;
		if (!shouldRender) {
			return null;
		}

		if (typeof icon === "string") {
			icon = <div className="icon"><FontAwesomeIcon icon={icon}/></div>;
		}

		return (
			<div className={`info ${className}`}>
				{icon}
				<span className="text">{typeof text === "function" ? text() : text}</span>
			</div>
		);
	}

	renderBorrowed(game) {
		if (!game.isBorrowed()) {
			return null;
		}

		return (
			<div className="borrowed">
				<Translate i18nKey="gameBorrowedBy" name={game.borrowed().fullName()}>
					Borrowed by %name%
				</Translate></div>
		);
	}

	render() {
		let { game } = this.props;
		let time = game.playtimeRange();

		return (
			<Link
				className={`gameCard${game.isBorrowed() ? " borrowed" : ""}`}
				to={`/game/${game.id()}`}
			>
				<div className="image">
					<img alt={`${game.name()} preview`} src={game.picture()}/>
				</div>
				<div className="summary-container">
					<h3 className="name">{game.name()}</h3>
					<div className="summary">
						{this.renderInfo("chess-pawn", game.playersRange())}
						{this.renderInfo("stopwatch", time)}
						{this.renderInfo("birthday-cake", () => `${game.minAge()}+`, { shouldRender: !!game.minAge })}
					</div>
					{this.renderBorrowed(game)}
				</div>
			</Link>
		);
	}
}
