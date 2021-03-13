// eslint-disable-line max-lines
import "./addGame.scss";
import {
	Button,
	Col,
	Container,
	Form,
	FormGroup,
	Input,
	Label,
	Modal,
	ModalBody,
	ModalHeader,
	Row
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GamePreview from "components/gamePreview/gamePreview";
import i18n from "i18n/i18n";
import info from "helpers/info";
import Loading from "components/loading/loading";
import Page from "../page";
import PropTypes from "prop-types";
import React from "react";
import { Redirect } from "react-router";
import Select from "react-select";
import Translate from "components/i18n/translate";

const DELAY = 500;

const allLanguages = {
	en: "us",
	fr: "fr"
};

export class GameAdditionCandidates extends React.Component {
	static defaultProps = {
		data: undefined,
		error: undefined
	}

	static propTypes = {
		addGame: PropTypes.func.isRequired,
		data: PropTypes.array,
		error: PropTypes.object,
		fetchVersions: PropTypes.func.isRequired,
		query: PropTypes.string.isRequired
	};

	state = {
		modalOpen: false
	};

	componentDidUpdate(prevProps) {
		if (prevProps.error !== this.props.error) {
			info.error({
				html: <Translate i18nKey="failedToLoadGame">Failed to load game!</Translate>
			});
		}
	}

	toggleModal() {
		this.setState((state) => ({
			modalOpen: !state.modalOpen
		}));
	}

	renderModal() {
		let toggle = this.toggleModal.bind(this);

		if (!this.state.versions || !this.state.gameToAdd) {
			return (
				<Modal className="choose-a-version centered loading" isOpen={this.state.modalOpen}>
					<Loading dark full/>
				</Modal>
			);
		}

		return (
			<Modal className="choose-a-version" isOpen={this.state.modalOpen} toggle={toggle}>
				<ModalHeader toggle={toggle}>
					<Translate i18nKey="add.chooseAVersion">
						Choose a version
					</Translate>
				</ModalHeader>
				<ModalBody>
					{this.state.versions.map((version) => (
						<div key={version.id} className="version" onClick={() => {
							let { id, name } = this.state.gameToAdd;
							this.props.addGame({
								id,
								version,
								name
							});
						}}>
							{/* eslint-disable-next-line no-process-env */}
							<img alt={version.name} src={version.picture || `${process.env.PUBLIC_URL}/missing.png`}/>
							<div className="name">{version.name}</div>
						</div>
					))}
				</ModalBody>
			</Modal>
		);
	}

	fetchVersions(lang, game) {
		this.setState({ modalOpen: true });

		this.props.fetchVersions(lang, game)
			.then((versions) => {
				if (versions.length === 1) {
					let { id } = game;
					this.props.addGame({
						id,
						version: versions[0],
						name: game.name
					});
				} else {
					this.setState({
						versions,
						gameToAdd: game
					});
				}
			});
	}

	render() {
		let { data, error, query } = this.props;

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
				{this.renderModal()}
				<div className="counter"><Translate count={data.length} i18nKey="gamesFound">%count% games
					found</Translate></div>
				<ul className="previews">
					{data.map((game) => {
						let { id, type } = game;
						return <li key={`${type}-${id}`} className="game-preview">
							<div className="buttons">
								{Object.keys(allLanguages).map((lang) => (
									<Button
										key={lang}
										className={`flag-icon flag-icon-${allLanguages[lang]}`}
										onClick={this.fetchVersions.bind(this, lang, game)}
									>
										<FontAwesomeIcon icon="plus"/>
									</Button>
								))}
							</div>
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
		location: PropTypes.object,
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
				placeholder={i18n.t("placeholder", "Select...")}
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
		goToGame: false,
		candidates: [],
		query: "",
		types: {
			boardgame: true,
			boardgameexpansion: true
		},
		exact: false,
		addMultiple: false,
		language: allLanguages[1]
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

	fetchVersions(lang, game) {
		return this.fetch(`/api/v1/game/versions/${game.id}/${lang}`);
	}

	addGame({ id, name, version }) {
		this.fetch("/api/v1/game", {
			method: "POST",
			body: {
				gameId: id,
				location: this.state.location.id,
				version
			}
		})
			.then((game) => {
				info.success({
					title: <Translate i18nKey="info.success">Success</Translate>,
					html: <Translate i18nKey="game.addedSuccessfully" name={game.name}>
						{"\"%name%\" successfully added"}
					</Translate>,
					onAfterClose: () => !this.state.addMultiple && this.setState({ goToGame: game.id })
				});
			})
			.catch(() => {
				info.error({
					html: <Translate i18nKey="game.addedUnsuccessfully" name={name}>
						{"Error while adding \"%name%\""}
					</Translate>,
					onAfterClose: () => this.setState({ modalOpen: false })
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
					<Col
						sm={{
							offset: 0,
							size: 9
						}}
						xs={{
							offset: 1,
							size: 11
						}}
					>
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
				<FormGroup row className="large-only">
					<Label for="exact" sm={3}><Translate i18nKey="exactMatch">Exact match?</Translate></Label>
					<Col sm={9}>
						<FormGroup check>
							<Input checked={this.state.exact} id="exact" name="exact" type="checkbox" onChange={this.onExact.bind(this)}/>{" "}
						</FormGroup>
					</Col>
				</FormGroup>
				<FormGroup row className="large-only">
					<Label for="add-multiple" sm={3}>
						<Translate i18nKey="addMultiple">Add multiple games?</Translate>
					</Label>
					<Col sm={9}>
						<FormGroup check>
							<Input checked={this.state.addMultiple} id="add-multiple" name="add-multiple" type="checkbox" onChange={this.onAddMultiple.bind(this)}/>{" "}
						</FormGroup>
					</Col>
				</FormGroup>
				<FormGroup row className="small-only">
					<Col>
						<FormGroup check>
							<Label check>
								<Input checked={this.state.exact} id="exact" name="exact" type="checkbox" onChange={this.onExact.bind(this)}/>{" "}
								<Translate i18nKey="exactMatch">Exact match?</Translate>
							</Label>
						</FormGroup>
						<FormGroup check>
							<Label check>
								<Input checked={this.state.addMultiple} id="add-multiple" name="add-multiple" type="checkbox" onChange={this.onAddMultiple.bind(this)}/>{" "}
								<Translate i18nKey="addMultiple">Add multiple games?</Translate>
							</Label>
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
		if (this.state.goToGame) {
			return <Redirect push to={`/game/${this.state.goToGame}`}/>;
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
								fetchVersions={this.fetchVersions.bind(this)}
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

