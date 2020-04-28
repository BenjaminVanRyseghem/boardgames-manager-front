import "./games.scss";
import { Col, Container, Row } from "reactstrap";
import fetcher from "helpers/fetcher";
import GameCard from "components/gameCard/gameCard";
import info from "helpers/info";
import Loading from "components/loading/loading";
import Menu from "components/menu/menu";
import Page from "../page";
import parseQuery from "helpers/parseQuery";
import querystring from "querystring";
import React from "react";
import Translate from "components/i18n/translate";
import useSWR from "swr";

function GamesContainer({ filters = {} }) { // eslint-disable-line react/prop-types
	const { data, error } = useSWR(`/api/v1/game?${querystring.stringify(filters)}`, fetcher);

	if (error) {
		info.error({
			html: <Translate i18nKey="failedToLoadGames">Failed to load games!</Translate>
		});
		return null;
	}
	if (!data) {
		return <div><Loading/></div>;
	}

	if (!data.length) {
		return (
			<Container className="content">
				<Row className="games">
					<div className="no-game"><Translate i18nKey="noGameFound">No game found!</Translate></div>
				</Row>
			</Container>
		);
	}

	return (
		<Container className="content">
			<Row className="games">
				{data.map((game) => <Col key={game.id} className="card-holder" sm={4}>
						<GameCard game={game}/>
					</Col>)}
			</Row>
		</Container>
	);
}

function CategoriesContainer({ transform }) {
	const { data, error } = useSWR("/api/v1/category", fetcher);

	if (error) {
		info.error({
			html: <Translate i18nKey="failedToLoadCategories">Failed to load categories!</Translate>
		});
		return null;
	}

	return transform(data);
}

function MechanicsContainer({ transform }) {
	const { data, error } = useSWR("/api/v1/mechanic", fetcher);

	if (error) {
		info.error({
			html: <Translate i18nKey="failedToLoadMechanics">Failed to load mechanics!</Translate>
		});
		return null;
	}

	return transform(data);
}

export default class Games extends Page {
	static key = "games";

	constructor() {
		super(...arguments); // eslint-disable-line prefer-rest-params

		this.state = {
			filters: this.initializeStateFromQueries(parseQuery(this.props.location.search))
		};
	}

	// eslint-disable-next-line max-statements
	initializeStateFromQueries(search) {
		if (!search) {
			return {};
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

		if (search.categories) {
			state.categories = [...search.categories.split(",")];
		}

		return state;
	}

	setGameFilters(filters) {
		let url = new URL(window.location.href.replace(window.location.search, ""));
		Object.keys(filters).forEach((key) => {
			url.searchParams.set(key.toString(), filters[key].toString());
		});
		window.history.replaceState({}, "", url.toString());
		this.setState({ filters });
	}

	renderContent() {
		return (
			<>
				<Menu
					categoriesContainer={CategoriesContainer}
					filters={this.state.filters}
					mechanicsContainer={MechanicsContainer}
					setGameFilters={this.setGameFilters.bind(this)}
				/>
				<GamesContainer filters={this.state.filters}/>
			</>
		);
	}
}
