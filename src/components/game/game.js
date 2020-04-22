import "./game.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import he from "he";
import PropTypes from "prop-types";
import React from "react";

export default class Game extends React.Component {
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
			icon = <FontAwesomeIcon icon={icon}/>;
		}

		return (
			<div className={`info ${className}`}>
				{icon}
				<span className="text">{typeof text === "function" ? text() : text}</span>
			</div>
		);
	}

	renderMechanics(game) {
		if (!game.mechanics) {
			return null;
		}

		let mechanics = (
			<ul className="mechanics">
				{game.mechanics.sort().map((mechanic) => <li key={mechanic.foreignID} className="mechanic">{mechanic.value}</li>)}
			</ul>
		);
		return (
			<div className="line multi">
				<div className="info mechanics">
					<div className="icon">
						<FontAwesomeIcon icon="cogs"/>
					</div>
					<div className="text">{mechanics}</div>
				</div>
			</div>
		);
	}

	render() {
		let { game } = this.props;
		let time = `${game.minPlaytime}'-${game.maxPlaytime}'`;

		if (game.minPlaytime === game.maxPlaytime) {
			time = `${game.minPlaytime}'`;
		}

		let categories = game.categories && (
			<ul className="categories">
				{game.categories.sort().map((category) => <li key={category.foreignID} className="category">{category.value}</li>)}
			</ul>
		);

		let { publisher } = game;

		if (game.yearPublished) {
			publisher += ` (${game.yearPublished})`;
		}

		return (
			<div>
				<div className="image">
					<img alt={`${game.name} preview`} src={game.picture}/>
				</div>
				<div className="summary">
					<div className="title">{game.name}</div>
					<div className={"info-bar"}>
						<div className="group main">
							<div className="line">
								{this.renderInfo("chess-pawn", `${game.minPlayers}-${game.maxPlayers}`)}
								{this.renderInfo("stopwatch", time)}
								{this.renderInfo("birthday-cake", game.minAge)}
								{this.renderInfo("map-marker-alt", () => game.location.name, { shouldRender: !!game.location })}
								{this.renderInfo("tags", categories, { className: "categories" })}
							</div>
							{this.renderMechanics(game)}
						</div>
						<span className="group stack float-right">
							{this.renderInfo("industry", publisher)}
							{this.renderInfo("door-open", () => `${game.borrowed.firstName} ${game.borrowed.lastName}`, { shouldRender: !!game.borrowed })}
						</span>
					</div>
					<div className="description">{he.decode(he.decode(game.description))}</div>
				</div>
			</div>
		);
	}
}

Game.propTypes = {
	game: PropTypes.object.isRequired
};
