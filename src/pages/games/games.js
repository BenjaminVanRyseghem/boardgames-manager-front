import "./games.scss";
import AddGameCard from "components/addGameCard/addGameCard";
import Category from "models/category";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Game from "models/game";
import GameCard from "components/gameCard/gameCard";
import info from "helpers/info";
import Loading from "components/loading/loading";
import Mechanic from "models/mechanic";
import Menu from "components/menu/menu";
import Page from "../page";
import parseQuery from "helpers/parseQuery";
import PropTypes from "prop-types";
import Publisher from "models/publisher";
import querystring from "querystring";
import React from "react";
import smallScreen from "../../helpers/smallScreen";
import Translate from "components/i18n/translate";

export class GamesContainer extends React.Component {
	static defaultProps = {
		data: undefined,
		error: undefined
	}

	static propTypes = {
		data: PropTypes.array,
		error: PropTypes.object,
		user: PropTypes.object
	};

	state = {};

	componentDidUpdate(prevProps) {
		if (prevProps.error !== this.props.error) {
			info.error({
				html: <Translate i18nKey="failedToLoadGames">Failed to load games!</Translate>
			});
		}
	}

	renderAddGame() {
		if (!this.props.user.canAddGames()) {
			return null;
		}

		return (
			<div key="new-game" className="card-holder">
				<AddGameCard/>
			</div>
		);
	}

	render() {
		let { data, error } = this.props;

		if (error) {
			return null;
		}
		if (!data) {
			return <div><Loading/></div>;
		}

		if (!data.length) {
			return (
				<div className="content">
					<div className="games">
						<div className="no-game"><Translate i18nKey="noGameFound">No game found!</Translate></div>
						{this.renderAddGame()}
					</div>
				</div>
			);
		}

		return (
			<div className="content">
				<div className="games">
					{this.renderAddGame()}
					{data.map((game) => <div key={game.id()} className="card-holder">
						<GameCard game={game}/>
					</div>)}
				</div>
			</div>
		);
	}
}

class MenuContainer extends React.Component {
	static propTypes = {
		data: PropTypes.array,
		error: PropTypes.object,
		html: PropTypes.object.isRequired,
		transform: PropTypes.func.isRequired
	};

	componentDidUpdate(prevProps) {
		if (prevProps.error !== this.props.error) {
			info.error({ html: this.props.html });
		}
	}

	render() {
		return this.props.transform(this.props.data);
	}
}

function PublishersContainer({ transformFn, data, error }) { // eslint-disable-line react/prop-types
	return (
		<MenuContainer
			data={data}
			error={error}
			html={<Translate i18nKey="failedToLoadPublishers">Failed to load publishers!</Translate>}
			transform={transformFn}
		/>
	);
}

function CategoriesContainer({ transformFn, data, error }) { // eslint-disable-line react/prop-types
	return (
		<MenuContainer
			data={data}
			error={error}
			html={<Translate i18nKey="failedToLoadCategories">Failed to load categories!</Translate>}
			transform={transformFn}
		/>
	);
}

function MechanicsContainer({ transformFn, data, error }) { // eslint-disable-line react/prop-types
	return (
		<MenuContainer
			data={data}
			error={error}
			html={<Translate i18nKey="failedToLoadMechanics">Failed to load mechanics!</Translate>}
			transform={transformFn}
		/>
	);
}

export default class Games extends Page {
	static key = "games";

	toggleMenuVisibility() {
		this.setState((state) => ({
			menuOpen: !state.menuOpen
		}));
	}

	constructor(...args) {
		super(...args);

		this.state = {
			filters: this.initializeStateFromQueries(parseQuery(this.props.location.search)),
			menuOpen: !smallScreen()
		};
	}

	// eslint-disable-next-line max-statements
	initializeStateFromQueries(search) {
		if (!search) {
			return {
				showExpansions: 0
			};
		}

		let state = {};

		if (search.name) {
			state.name = search.name;
		}

		if (search.numberOfPlayers) {
			state.numberOfPlayers = +search.numberOfPlayers;
			state.numberOfPlayersFilter = true;
		}

		if (search.age) {
			state.age = +search.age;
			state.ageFilter = true;
		}

		if (search.showBorrowed) {
			state.showBorrowedFilter = !!+search.showBorrowed;
			state.showBorrowed = state.showBorrowedFilter ? 1 : 0;
		}

		if (search.showFavorites) {
			state.showFavoritesFilter = !!+search.showFavorites;
			state.showFavorites = state.showFavoritesFilter ? 1 : 0;
		}

		state.showExpansions = +search.showExpansions ? 1 : 0;

		if (search.categories) {
			state.categories = [...search.categories.split(",")];
		}

		if (search.mechanics) {
			state.mechanics = [...search.mechanics.split(",")];
		}

		if (search.publishers) {
			state.publishers = [...search.publishers.split(",")];
		}

		return state;
	}

	setGameFilters(filters) {
		let url = new URL(window.location.href.replace(window.location.search, ""));
		Object.keys(filters).forEach((key) => {
			if (key.toString() === "showExpansions") {
				if (filters[key] === 1) {
					url.searchParams.set("showExpansions", "1");
				}
			} else {
				url.searchParams.set(key.toString(), filters[key].toString());
			}
		});
		window.history.replaceState({}, "", url.toString());
		this.setState({ filters });
	}

	renderContent() {
		return (
			<div className={`wrapper ${this.state.menuOpen ? "menu-opened" : "menu-closed"}`}>
				<div className="hider" onClick={this.toggleMenuVisibility.bind(this)}>
					<div className="wrapper">
						{this.state.menuOpen
							? <FontAwesomeIcon className="icon" icon="angle-left"/>
							: <FontAwesomeIcon className="icon" icon="angle-right"/>
						}
					</div>
				</div>
				<Menu
					categoriesContainer={<this.swr model={Category} url="/api/v1/category"><CategoriesContainer/>
					</this.swr>}
					filters={this.state.filters}
					mechanicsContainer={<this.swr model={Mechanic} url="/api/v1/mechanic"><MechanicsContainer/>
					</this.swr>}
					publishersContainer={<this.swr model={Publisher} url="/api/v1/publisher"><PublishersContainer/>
					</this.swr>}
					setGameFilters={this.setGameFilters.bind(this)}
				/>
				<this.swr model={Game} url={`/api/v1/game?${querystring.stringify(this.state.filters)}`}>
					<GamesContainer
						user={this.props.user}/>
				</this.swr>
			</div>
		);
	}
}
