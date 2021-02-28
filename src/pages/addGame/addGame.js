// eslint-disable-line max-lines
import "./addGame.scss";
import { Button, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GamePreview from "components/gamePreview/gamePreview";
import info from "helpers/info";
import Loading from "components/loading/loading";
import Page from "../page";
import PropTypes from "prop-types";
import React from "react";
import { Redirect } from "react-router";
import Select from "react-select";
import Translate from "components/i18n/translate";

const DELAY = 500;

export class GameAdditionCandidates extends React.Component {
	static defaultProps = {
		data: undefined,
		error: undefined
	}

	static propTypes = {
		addGame: PropTypes.func.isRequired,
		data: PropTypes.array,
		error: PropTypes.object,
		query: PropTypes.string.isRequired
	};

	state = {};

	componentDidUpdate(prevProps) {
		if (prevProps.error !== this.props.error) {
			info.error({
				html: <Translate i18nKey="failedToLoadGame">Failed to load game!</Translate>
			});
		}
	}

	render() {
		let { data, error, addGame, query } = this.props;

		if (error) {
			return null;
		}

		if (!data) {
			return <div className="loading"><Loading/></div>;
		}

		if (!data.length) {
			return <div className="no-game"><Translate i18nKey="noGameFound">No game found!</Translate></div>;
		}

		return (
			<div className="candidates">
				<div className="counter"><Translate count={data.length} i18nKey="gamesFound">%count% games
					found</Translate></div>
				<ul className="previews">
					{data.map((game) => {
						let { id, nameType, type } = game;
						return <li key={`${type}-${id}`} className="game-preview">
							<Button onClick={() => addGame({
								id,
								nameType,
								name: game.name
							})}><FontAwesomeIcon icon="plus"/></Button>
							<div className="content">
								<GamePreview data={game} query={query}/>
							</div>
						</li>;
					})}
				</ul>
			</div>
		);
	}
}

class LocationContainer extends React.Component {
	static propTypes = {
		location: PropTypes.string,
		locations: PropTypes.array,
		onLocationChange: PropTypes.func.isRequired
	}

	componentDidUpdate(prevProps) {
		if (!this.props.location && prevProps.locations !== this.props.locations) {
			this.props.onLocationChange(this.props.locations.find((each) => each.id === "1"));
		}
	}

	render() {
		if (!this.props.locations) {
			return <Select disable loading/>;
		}

		return (
			<Select
				className="locations-select"
				formatOptionLabel={(option) => <div className="name">
					{option.name}<span><Translate count={option.numberOfGames} i18nKey="numberOfGames">(%count% games)</Translate></span>
				</div>}
				getOptionLabel={(option) => option.name}
				getOptionValue={(option) => option.id}
				options={this.props.locations}
				value={this.props.location}
				onChange={this.props.onLocationChange}
			/>
		);
	}
}

export default class AddGame extends Page {
	title = <Translate i18nKey="addAGame">Add a game</Translate>;

	state = {
		location: null,
		backToGames: false,
		candidates: [],
		query: "",
		types: {
			boardgame: true,
			boardgameexpansion: true
		},
		exact: false,
		addMultiple: false
	}

	onSearch({ target: { value: query } }) {
		if (this.state.query !== query) {
			if (this.timeout) {
				clearTimeout(this.timeout);
			}

			this.timeout = setTimeout(() => {
				this.setState({ query });
			}, DELAY);
		}
	}

	onType(type, { target: { checked } }) {
		this.setState((previousState) => ({
			types: {
				...previousState.types,
				[type]: checked
			}
		}));
	}

	onExact({ target: { checked: exact } }) {
		this.setState({ exact });
	}

	onAddMultiple({ target: { checked: addMultiple } }) {
		this.setState({ addMultiple });
	}

	isChecked(type) {
		return !!this.state.types[type];
	}

	onLocationChange(location) {
		this.setState({ location });
	}

	addGame({ id, nameType, name }) {
		this.fetch(`/api/v1/game/${id}`, {
			method: "POST",
			body: {
				location: this.state.location.id,
				nameType,
				name
			}
		})
			.then(() => {
				info.success({
					title: <Translate i18nKey="info.success">Success</Translate>,
					html: <Translate i18nKey="game.addedSuccessfully" name={name}>
						{"\"%name%\" successfully added"}
					</Translate>,
					onAfterClose: () => !this.state.addMultiple && this.setState({ backToGames: true })
				});
			})
			.catch(() => {
				info.error({
					html: <Translate i18nKey="game.addedUnsuccessfully" name={name}>
						{"Error while adding \"%name%\""}
					</Translate>
				});
			});
	}

	sortLocations(locations) {
		return locations.sort((one, another) => one.name.localeCompare(another.name));
	}

	renderForm() {
		return (
			<Form onSubmit={(event) => event.preventDefault()}>
				<FormGroup row>
					<Label for="name" sm={3}><Translate i18nKey="name">Name</Translate></Label>
					<Col sm={9}>
						<Input autoFocus id="name" type="text" onChange={this.onSearch.bind(this)}/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Label for="type" sm={3}>Type</Label>
					<Col sm={9}>
						<FormGroup check>
							<Label check>
								<Input checked={this.isChecked("boardgame")} id="type-boardgame" name="boardgame" type="checkbox" onChange={this.onType.bind(this, "boardgame")}/>{" "}
								<Translate i18nKey="boardgame">Boardgame</Translate>
							</Label>
						</FormGroup>
						<FormGroup check>
							<Label check>
								<Input checked={this.isChecked("boardgameexpansion")} id="type-boardgameexpansion" name="boardgameexpansion" type="checkbox" onChange={this.onType.bind(this, "boardgameexpansion")}/>{" "}
								<Translate i18nKey="boardgameExpansion">Boardgame Expansion</Translate>
							</Label>
						</FormGroup>
						<FormGroup check>
							<Label check>
								<Input checked={this.isChecked("boardgameaccessory")} id="type-boardgameaccessory" name="boardgameaccessory" type="checkbox" onChange={this.onType.bind(this, "boardgameaccessory")}/>{" "}
								<Translate i18nKey="boardgameAccessory">Boardgame Accessory</Translate>
							</Label>
						</FormGroup>
						<FormGroup check>
							<Label check>
								<Input checked={this.isChecked("videogame")} id="type-videogame" name="videogame" type="checkbox" onChange={this.onType.bind(this, "videogame")}/>{" "}
								<Translate i18nKey="videoGame">Video Game</Translate>
							</Label>
						</FormGroup>
						<FormGroup check>
							<Label check>
								<Input checked={this.isChecked("rpgitem")} id="type-rpgitem" name="rpgitem" type="checkbox" onChange={this.onType.bind(this, "rpgitem")}/>{" "}
								<Translate i18nKey="rpg">RPG</Translate>
							</Label>
						</FormGroup>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Label for="exact" sm={3}><Translate i18nKey="exactMatch">Exact match?</Translate></Label>
					<Col sm={9}>
						<FormGroup check>
							<Input checked={this.state.exact} id="exact" name="exact" type="checkbox" onChange={this.onExact.bind(this)}/>{" "}
						</FormGroup>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Label for="add-multiple" sm={3}>
						<Translate i18nKey="addMultiple">Add multiple games?</Translate>
					</Label>
					<Col sm={9}>
						<FormGroup check>
							<Input checked={this.state.addMultiple} id="add-multiple" name="add-multiple" type="checkbox" onChange={this.onAddMultiple.bind(this)}/>{" "}
						</FormGroup>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Label for="add-location" sm={3}>
						<Translate i18nKey="location">Location</Translate>
					</Label>
					<Col sm={9}>
						<FormGroup check>
							<this.swr as="locations" transform={this.sortLocations.bind(this)} url="/api/v1/location">
								<LocationContainer
									location={this.state.location}
									onLocationChange={this.onLocationChange.bind(this)}
								/>
							</this.swr>
						</FormGroup>
					</Col>
				</FormGroup>
			</Form>
		);
	}

	renderContent() {
		if (this.state.backToGames) {
			return <Redirect push to="/games"/>;
		}

		let selectedTypes = Object.keys(this.state.types).filter((key) => this.state.types[key]);
		let stringifiedTypes = selectedTypes.length ? selectedTypes.join(",") : "boardgame,boardgameexpansion";

		return (
			<div className="addGame">
				<Container>
					<Row>
						<Col className="form-container" sm="12">
							{this.renderForm()}
						</Col>
					</Row>
					{this.state.query && <Row>
						<this.swr url={`/api/v1/search/bgg?name=${this.state.query}&type=${stringifiedTypes}&exact=${this.state.exact}`}>
							<GameAdditionCandidates
								addGame={this.addGame.bind(this)}
								owner={this}
								query={this.state.query}
							/>
						</this.swr>
					</Row>}
				</Container>
			</div>
		);
	}
}

