import "./gameInfo.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import he from "he";
import Interpolate from "components/i18n/interpolate";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";
import Translate from "components/i18n/translate";

export default class GameInfo extends React.Component {
	static defaultProps = {};

	static propTypes = {
		game: PropTypes.object.isRequired,
		user: PropTypes.object.isRequired
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

	renderBorrower(borrowed) {
		if (!this.props.user.canViewUsers()) {
			return () => (
				<Translate
					i18nKey="gameBorrowedBy"
					name={`${borrowed.firstName} ${borrowed.lastName}`}
				>
					Borrowed by %name%
				</Translate>
			);
		}
		return () => (
			<Interpolate
				i18nKey="gameBorrowedByWithLink"
				name={`${borrowed.firstName} ${borrowed.lastName}`}
			>
				Borrowed by <a href={`/user/${borrowed.id}`}>%name%</a>
			</Interpolate>
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
				{game.categories.sort().map((category) => <div key={category.id} className="tag category">
					<Link to={`/games?categories=${category.id}`}>
						{category.value}
					</Link>
				</div>)}
			</>
		);

		let mechanics = game.mechanics && (
			<>
				{game.mechanics.sort().map((mechanic) => <div key={mechanic.id} className="tag category">
					<Link to={`/games?mechanics=${mechanic.id}`}>
						{mechanic.value}
					</Link>
				</div>)}
			</>
		);

		let publishers = game.publishers && (
			<>
				{game.publishers.sort().map((publisher) => <div key={publisher.id} className="tag publisher">
					<Link to={`/games?publishers=${publisher.id}`}>
						{publisher.value}
					</Link>
				</div>)}
			</>
		);

		return (
			<div className="gameInfo">
				{this.renderTitle(game)}
				<div className="summary-container">
					<div className="image">
						<img alt={`${game.name} preview`} src={game.picture}/>
					</div>
					<div className="summary">
						<div className="line-container">
							{!!game.borrowed && <div className="line">
								{this.renderInfo("door-open", this.renderBorrower(game.borrowed), {
									className: "borrowed"
								})}
							</div>}
							<div className="line multi">
								{this.renderInfo("chess-pawn", `${game.minPlayers}-${game.maxPlayers}`)}
								{this.renderInfo("stopwatch", time)}
								{this.renderInfo("birthday-cake", () => `${game.minAge}+`, { shouldRender: !!game.minAge })}
							</div>
							{game.location && <div className="line">
								{this.renderInfo("map-marker-alt", () => <div className="tag">
									<Link to={`/location/${game.location.id}`}>{game.location.name}</Link>
								</div>, { className: "location tags" })}
							</div>}
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
