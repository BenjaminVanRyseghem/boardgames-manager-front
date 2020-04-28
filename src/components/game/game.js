import "./game.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import he from "he";
import { Link } from "react-router-dom";
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
				<div className="icon">
					{icon}
				</div>
				<span className="text">{typeof text === "function" ? text() : text}</span>
			</div>
		);
	}

	renderTitle(game) {
		let icon = game.borrowed ? <FontAwesomeIcon className="title-icon" icon="door-open"/> : null;

		return (
			<h1 className="title">{icon}{game.name}</h1>
		);
	}

	render() {
		let { game } = this.props;
		let time = `${game.minPlaytime}'-${game.maxPlaytime}'`;

		if (game.minPlaytime === game.maxPlaytime) {
			time = `${game.minPlaytime}'`;
		}

		let categories = game.categories && (
			<>
				{/* eslint-disable-next-line no-underscore-dangle */}
				{game.categories.sort().map((category) => <div key={category._id} className="tag category">
					{/* eslint-disable-next-line no-underscore-dangle */}
					<Link to={`/games?categories=${category._id}`}>
						{category.value}
					</Link>
				</div>)}
			</>
		);

		let mechanics = game.mechanics && (
			<>
				{/* eslint-disable-next-line no-underscore-dangle */}
				{game.mechanics.sort().map((mechanic) => <div key={mechanic._id} className="tag category">
					{/* eslint-disable-next-line no-underscore-dangle */}
					<Link to={`/mechanic/${mechanic._id}`}>
						{mechanic.value}
					</Link>
				</div>)}
			</>
		);

		let publishers = game.publishers && (
			<>
				{/* eslint-disable-next-line no-underscore-dangle */}
				{game.publishers.sort().map((publisher) => <div key={publisher._id} className="tag publisher">
					{/* eslint-disable-next-line no-underscore-dangle */}
					<Link to={`/publisher/${publisher._id}`}>
						{publisher.value}
					</Link>
				</div>)}
			</>
		);

		return (
			<div className="game">
				{this.renderTitle(game)}
				<div className="summary-container">
					<div className="image">
						<img alt={`${game.name} preview`} src={game.picture}/>
					</div>
					<div className="summary">
						<div className="line-container">
							{!!game.borrowed && <div className="line">
								{this.renderInfo("door-open", () => `${game.borrowed.firstName} ${game.borrowed.lastName}`, {
									className: "borrowed"
								})}
							</div>}
							<div className="line multi">
								{this.renderInfo("chess-pawn", `${game.minPlayers}-${game.maxPlayers}`)}
								{this.renderInfo("stopwatch", time)}
								{this.renderInfo("birthday-cake", () => `${game.minAge}+`, { shouldRender: !!game.minAge })}
								{this.renderInfo("map-marker-alt", () => game.location.name, { shouldRender: !!game.location })}
							</div>
							<div className="line">
								{this.renderInfo("tags", categories, { className: "categories tags" })}
							</div>
							<div className="line">
								{this.renderInfo("cogs", mechanics, { className: "mechanics tags" })}
							</div>
							<div className="line">
								{this.renderInfo("industry", publishers, { className: "publishers tags" })}
							</div>
							<div className="line">
								{this.renderInfo(
									<FontAwesomeIcon icon={["far", "calendar"]}/>,
									game.yearPublished,
									{ shouldRender: !!game.yearPublished }
								)}
							</div>
						</div>
						<div className="description">{he.decode(he.decode(game.description))}</div>
					</div>
				</div>
			</div>
		);
	}
}
