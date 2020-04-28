import "./addGame.scss";
import { Button, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import fetcher from "helpers/fetcher";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GamePreview from "components/gamePreview/gamePreview";
import info from "helpers/info";
import Loading from "components/loading/loading";
import Page from "../page";
import React from "react";
import { Redirect } from "react-router";
import Translate from "components/i18n/translate";
import useSWR from "swr";

const DELAY = 500;

function Candidates({ addGame, query = "", types = {}, exact = false }) { // eslint-disable-line react/prop-types
	let selectedTypes = Object.keys(types).filter((key) => types[key]);
	let stringifiedTypes = selectedTypes.length ? selectedTypes.join(",") : "boardgame,boardgameexpansion";

	let { data, error } = useSWR(`api/v1/search/bgg?name=${query}&type=${stringifiedTypes}&exact=${exact}`, fetcher);

	if (error) {
		info.error({
			html: <Translate i18nKey="failedToLoadGames">Failed to load games!</Translate>
		});
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
			<div className="counter"><Translate count={data.length} i18nKey="gamesFound">%count% games found</Translate></div>
			<ul className="previews">
				{data.map((game) => {
					let { id } = game;
					return <li key={id} className="game-preview">
						<Button onClick={() => addGame(id, game.name)}><FontAwesomeIcon icon="plus"/></Button>
						<div className="content">
							<GamePreview data={game} query={query}/>
						</div>
					</li>;
				})}
			</ul>
		</div>
	);
}

export default class AddGame extends Page {
	title = <Translate i18nKey="addAGame">Add a game</Translate>;

	state = {
		backToGames: false,
		candidates: [],
		query: "",
		types: {
			boardgame: true,
			boardgameexpansion: true
		},
		exact: false
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

	isChecked(type) {
		return !!this.state.types[type];
	}

	addGame(id, name) {
		this.fetch(`/api/v1/game/${id}`, {
			method: "POST"
		})
			.then(() => {
				info.success({
					title: <Translate i18nKey="success">Success</Translate>,
					html: <Translate i18nKey="gameAddedSuccessfully" name={name}>
							{"\"%name%\" successfully added"}
						</Translate>,
					onAfterClose: () => this.setState({ backToGames: true })
				});
			})
			.catch(() => {
				info.error({
					html: <Translate i18nKey="gameAddedUnsuccessfully" name={name}>
						{"Error while adding \"%name%\""}
					</Translate>
				});
			});
	}

	renderForm() {
		return (
			<Form onSubmit={(event) => event.preventDefault()}>
				<FormGroup row>
					<Label for="name" sm={2}><Translate i18nKey="name">Name</Translate></Label>
					<Col sm={10}>
						<Input autoFocus id="name" type="text" onChange={this.onSearch.bind(this)}/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Label for="type" sm={2}>Type</Label>
					<Col sm={10}>
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
					<Label for="exact" sm={2}><Translate i18nKey="exactMatch">Exact match?</Translate></Label>
					<Col sm={10}>
						<FormGroup check>
							<Input checked={this.state.exact} id="exact" name="exact" type="checkbox" onChange={this.onExact.bind(this)}/>{" "}
						</FormGroup>
					</Col>
				</FormGroup>
			</Form>
		);
	}

	renderContent() {
		if (this.state.backToGames) {
			return <Redirect to="/games"/>;
		}

		return (
			<div className="addGame">
				<Container>
					<Row>
						<Col className="form-container" sm="12">
							{this.renderForm()}
						</Col>
					</Row>
					{this.state.query && <Row>
						<Candidates
							addGame={this.addGame.bind(this)}
							owner={this}
							query={this.state.query}
							types={this.state.types}
						/>
					</Row>}
				</Container>
			</div>
		);
	}
}

