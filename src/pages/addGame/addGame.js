import "./addGame.scss";
import { Col, Form, FormGroup, Input, Label } from "reactstrap";
import fetcher from "helpers/fetcher";
import GamePreview from "components/gamePreview/gamePreview";
import Loading from "components/loading/loading";
import Page from "../page";
import React from "react";
import useSWR from "swr";

const DELAY = 500;

function Candidates({ query = "", types = {}, exact = false }) { // eslint-disable-line react/prop-types
	let selectedTypes = Object.keys(types).filter((key) => types[key]);
	let stringifiedTypes = selectedTypes.length ? selectedTypes.join(",") : "boardgame,boardgameexpansion";
	const { data, error } = useSWR(`api/v1/search/bgg?name=${query}&type=${stringifiedTypes}&exact=${exact}`, fetcher);

	if (error) {
		return <div>failed to load</div>;
	}
	if (!data) {
		return <div><Loading/></div>;
	}

	if (!data.length) {
		return <div>No game found</div>;
	}

	// eslint-disable-next-line no-underscore-dangle
	return (
		<div className="candidates">
			<div className="counter">{data.length} matching results</div>
			<ul className="games">
				{data.rows.map((game) => {
					// eslint-disable-next-line no-underscore-dangle
					let id = game._id;
					return <li key={id} className="game"><GamePreview data={game} query={query}/></li>;
				})}
			</ul>
		</div>
	);
}

export default class AddGame extends Page {
	title = "Add a game";

	state = {
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

	renderContent() {
		return (
			<div className="add-game">
				<Form>
					<FormGroup row>
						<Label for="name" sm={2}>Name</Label>
						<Col sm={10}>
							<Input id="name" type="text" onChange={this.onSearch.bind(this)}/>
						</Col>
					</FormGroup>
					<FormGroup row>
						<Label for="type" sm={2}>Type</Label>
						<Col sm={10}>
							<FormGroup check>
								<Label check>
									<Input checked={this.isChecked("boardgame")} id="type-boardgame" name="boardgame" type="checkbox" onChange={this.onType.bind(this, "boardgame")}/>{" "}
									Boardgame
								</Label>
							</FormGroup>
							<FormGroup check>
								<Label check>
									<Input checked={this.isChecked("boardgameexpansion")} id="type-boardgameexpansion" name="boardgameexpansion" type="checkbox" onChange={this.onType.bind(this, "boardgameexpansion")}/>{" "}
									Boardgame Expansion
								</Label>
							</FormGroup>
							<FormGroup check>
								<Label check>
									<Input checked={this.isChecked("boardgameaccessory")} id="type-boardgameaccessory" name="boardgameaccessory" type="checkbox" onChange={this.onType.bind(this, "boardgameaccessory")}/>{" "}
									Boardgame Accessory
								</Label>
							</FormGroup>
							<FormGroup check>
								<Label check>
									<Input checked={this.isChecked("videogame")} id="type-videogame" name="videogame" type="checkbox" onChange={this.onType.bind(this, "videogame")}/>{" "}
									Video Game
								</Label>
							</FormGroup>
							<FormGroup check>
								<Label check>
									<Input checked={this.isChecked("rpgitem")} id="type-rpgitem" name="rpgitem" type="checkbox" onChange={this.onType.bind(this, "rpgitem")}/>{" "}
									RPG
								</Label>
							</FormGroup>
						</Col>
					</FormGroup>
					<FormGroup row>
						<Label for="exact" sm={2}>Exact match?</Label>
						<Col sm={10}>
							<Input checked={this.state.exact} id="exact" name="exact" type="checkbox" onChange={this.onExact.bind(this)}/>{" "}
						</Col>
					</FormGroup>
				</Form>
				<Candidates exact={this.state.exact} query={this.state.query} types={this.state.types}/>
			</div>
		);
	}
}

