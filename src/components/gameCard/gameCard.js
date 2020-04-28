import "./gameCard.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import React from "react";
import Translate from "../i18n/translate";

export default class GameCard extends React.Component {
	static defaultProps = {
		onClick: () => {}
	};

	static propTypes = {
		game: PropTypes.object.isRequired,
		onClick: PropTypes.func
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
		if (!game.borrowed) {
			return null;
		}

		return (
			<div className="borrowed">
				<Translate i18nKey="gameBorrowedBy" name={`${game.borrowed.firstName} ${game.borrowed.lastName}`}>
					Borrowed by %name%
				</Translate></div>
		);
	}

	render() {
		let { game } = this.props;
		let time = `${game.minPlaytime}'-${game.maxPlaytime}'`;

		if (game.minPlaytime === game.maxPlaytime) {
			time = `${game.minPlaytime}'`;
		}

		return (
			// eslint-disable-next-line no-underscore-dangle
			<a className={`gameCard${game.borrowed ? " borrowed" : ""}`} href={`/game/${game._id}`} onClick={this.props.onClick}>
				<div className="image">
					<img alt={`${game.name} preview`} src={game.picture}/>
				</div>
				<div className="summary-container">
					<h3 className="name">{game.name}</h3>
					<div className="summary">
						{this.renderInfo("chess-pawn", `${game.minPlayers}-${game.maxPlayers}`)}
						{this.renderInfo("stopwatch", time)}
						{this.renderInfo("birthday-cake", () => `${game.minAge}+`, { shouldRender: !!game.minAge })}
					</div>
				{this.renderBorrowed(game)}
				</div>
			</a>
		);
	}
}
