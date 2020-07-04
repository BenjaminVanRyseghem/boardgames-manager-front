import "./games.scss";
import { Col, Container, Row } from "reactstrap";
import AddGameCard from "components/addGameCard/addGameCard";
import GameCard from "components/gameCard/gameCard";
import info from "helpers/info";
import Loading from "components/loading/loading";
import Menu from "components/menu/menu";
import Page from "../page";
import parseQuery from "helpers/parseQuery";
import PropTypes from "prop-types";
import querystring from "querystring";
import React from "react";
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
			<Col key="new-game" className="card-holder" sm={4}>
				<AddGameCard/>
			</Col>
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
					{this.renderAddGame()}
					{data.map((game) => <Col key={game.id} className="card-holder" sm={4}>
						<GameCard game={game}/>
					</Col>)}
				</Row>
			</Container>
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

function PublishersContainer({ transform, data, error }) { // eslint-disable-line react/prop-types
	return (
		<MenuContainer
			data={data}
			error={error}
			html={<Translate i18nKey="failedToLoadPublishers">Failed to load publishers!</Translate>}
			transform={transform}
		/>
	);
}

function CategoriesContainer({ transform, data, error }) { // eslint-disable-line react/prop-types
	return (
		<MenuContainer
			data={data}
			error={error}
			html={<Translate i18nKey="failedToLoadCategories">Failed to load categories!</Translate>}
			transform={transform}
		/>
	);
}

function MechanicsContainer({ transform, data, error }) { // eslint-disable-line react/prop-types
	return (
		<MenuContainer
			data={data}
			error={error}
			html={<Translate i18nKey="failedToLoadMechanics">Failed to load mechanics!</Translate>}
			transform={transform}
		/>
	);
}

export default class Games extends Page {
	static key = "games";

	constructor(...args) {
		super(...args);

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
			url.searchParams.set(key.toString(), filters[key].toString());
		});
		window.history.replaceState({}, "", url.toString());
		this.setState({ filters });
	}

	renderContent() {
		return (
			<>
				<Menu
					categoriesContainer={<this.swr url="/api/v1/category"><CategoriesContainer/></this.swr>}
					filters={this.state.filters}
					mechanicsContainer={<this.swr url="/api/v1/mechanic"><MechanicsContainer/></this.swr>}
					publishersContainer={<this.swr url="/api/v1/publisher"><PublishersContainer/></this.swr>}
					setGameFilters={this.setGameFilters.bind(this)}
				/>
				<this.swr url={`/api/v1/game?${querystring.stringify(this.state.filters)}`}>
					<GamesContainer user={this.props.user}/>
				</this.swr>
			</>
		);
	}
}
