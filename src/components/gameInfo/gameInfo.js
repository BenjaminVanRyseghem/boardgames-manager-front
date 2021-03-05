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
		let icon = game.isBorrowed() ? <FontAwesomeIcon className="title-icon borrowed" icon="door-open"/> : null;
		let favoriteIcon = game.favorite()
			? <FontAwesomeIcon
				className="title-icon like"
				icon="star"
			/>
			: null;

		return (
			<h1 className="title"><span className="container">
				{icon}{game.name()}{favoriteIcon}
			</span></h1>
		);
	}

	renderBorrower(borrowed) {
		if (!this.props.user.canViewUsers()) {
			return () => (
				<Translate
					i18nKey="gameBorrowedBy"
					name={borrowed.fullName()}
				>
					Borrowed by %name%
				</Translate>
			);
		}
		return () => (
			<Interpolate
				i18nKey="gameBorrowedByWithLink"
				name={borrowed.fullName()}
			>
				Borrowed by <a href={`/user/${borrowed.id()}`}>%name%</a>
			</Interpolate>
		);
	}

	renderExpansion(expansion) {
		return (
			<div key={expansion.id()} className="expansion">
				<Link to={`/game/${expansion.id()}`}>
					<img alt={expansion.name()} src={expansion.picture()}/>
				</Link>
			</div>
		);
	}

	renderExpansions() {
		let { game } = this.props;
		let expansions = game.expansions();

		if (!expansions || !expansions.length) {
			return null;
		}

		return (
			<div className="expansions">
				{expansions.map((expansion) => this.renderExpansion(expansion))}
			</div>
		);
	}

	renderExpand() {
		let { game } = this.props;
		let expand = game.expand();

		if (!expand) {
			return null;
		}

		return (
			<div className="expand">
				<Link to={`/game/${expand.id()}`}>
					<img alt={expand.name()} src={expand.picture()}/>
				</Link>
			</div>
		);
	}

	render() {
		let { game } = this.props;
		let time = game.playtimeRange();

		let categories = game.categories && (
			<>
				{game.categories()
					.sort()
					.map((category) => <div key={category.id()} className="tag category">
						<Link to={`/?categories=${category.id()}`}>
							{category.name()}
						</Link>
					</div>)}
			</>
		);

		let mechanics = game.mechanics() && (
			<>
				{game.mechanics()
					.sort()
					.map((mechanic) => <div key={mechanic.id()} className="tag category">
						<Link to={`/?mechanics=${mechanic.id()}`}>
							{mechanic.name()}
						</Link>
					</div>)}
			</>
		);

		let publishers = game.publishers() && (
			<>
				{game.publishers()
					.sort()
					.map((publisher) => <div key={publisher.id()} className="tag publisher">
						<Link to={`/?publishers=${publisher.id()}`}>
							{publisher.name()}
						</Link>
					</div>)}
			</>
		);

		return (
			<div className="gameInfo">
				{this.renderTitle(game)}
				<div className="summary-container">
					<div className="image">
						<a href={game.link()} rel="noopener noreferrer" target="_blank">
							<img alt={`${game.name()} preview`} src={game.picture()}/>
						</a>
					</div>
					<div className="summary">
						<div className="line-container">
							{!!game.isBorrowed() && <div className="line">
								{this.renderInfo("door-open", this.renderBorrower(game.borrowed()), {
									className: "borrowed"
								})}
							</div>}
							<div className="line multi">
								{this.renderInfo("chess-pawn", game.playersRange())}
								{this.renderInfo("stopwatch", time)}
								{this.renderInfo("birthday-cake", () => `${game.minAge()}+`, { shouldRender: !!game.minAge() })}
							</div>
							{game.location() && this.props.user.canNavigateToLocations() && <div className="line">
								{this.renderInfo("map-marker-alt", () => <div className="tag">
									<Link to={`/location/${game.location().id()}`}>{game.location().name()}</Link>
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
									game.yearPublished(),
									{ shouldRender: !!game.yearPublished() }
								)}
							</div>
						</div>
						<div className="description">{he.decode(he.decode(game.description()))}</div>
						{this.renderExpansions()}
						{this.renderExpand()}
					</div>
				</div>
			</div>
		);
	}
}
