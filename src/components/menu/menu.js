import "./menu.scss";
import { FormGroup, Input, Label } from "reactstrap";
import globalState from "models/globalState";
import InputRange from "react-input-range";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";
import Switch from "components/switch/switch";
import Translate from "../i18n/translate";

const DELAY = 500;

const updatableKeys = [
	"age",
	"categories",
	"mechanics",
	"numberOfPlayers",
	"name",
	"showBorrowed"
];

const defaults = {
	name: "",
	numberOfPlayers: 2
};

const defaultState = {
	categories: [],
	categoriesFilter: true,
	mechanics: [],
	mechanicsFilter: true,
	numberOfPlayers: null,
	name: "",
	numberOfPlayersFilter: false,
	nameFilter: true,
	showBorrowed: 1,
	showBorrowedFilter: false,
	age: 18,
	ageFilter: false
};

export default class Menu extends React.Component {
	static defaultProps = {
		filters: {}
	};

	static propTypes = {
		categoriesContainer: PropTypes.func.isRequired,
		filters: PropTypes.object,
		mechanicsContainer: PropTypes.func.isRequired,
		setGameFilters: PropTypes.func.isRequired
	};

	timeout = null;

	constructor() {
		super(...arguments); // eslint-disable-line prefer-rest-params

		this.state = Object.assign({}, defaultState, this.props.filters);
	}

	buildFilters() {
		let result = {};
		updatableKeys.forEach((name) => {
			let state = this.getStateFor(name);
			if (state === null || state === "" || (state.constructor === Array && !state.length)) {
				return;
			}

			result[name] = state;
		});

		return result;
	}

	getStateFor(key, state = this.state) {
		if (!state[`${key}Filter`]) {
			return null;
		}

		return state[key] || defaults[key];
	}

	componentDidUpdate(prevProps, prevState) {
		updatableKeys.forEach((key) => {
			let state = this.getStateFor(key);
			if (state !== this.getStateFor(key, prevState)) {
				if (this.timeout) {
					clearTimeout(this.timeout);
				}

				this.timeout = setTimeout(() => {
					this.props.setGameFilters(this.buildFilters());
				}, DELAY);
			}
		});
	}

	changeName(event) {
		this.setState({ name: event.target.value });
	}

	numberOfPlayersFilter({ target: { checked: numberOfPlayersFilter } }) {
		this.setState({ numberOfPlayersFilter });
	}

	showBorrowedFilter({ target: { checked: showBorrowedFilter } }) {
		this.setState({ showBorrowedFilter });
	}

	ageFilter({ target: { checked: ageFilter } }) {
		this.setState({ ageFilter });
	}

	renderActions() {
		let actions = [];

		if (globalState.user().canAddGames()) {
			actions.push(<Link key="add-game" to="/add-game"><Translate i18nKey="addAGameAction">+ add a
				game</Translate></Link>);
		}

		return (
			<div className="action">
				<div>
					{actions}
				</div>
			</div>
		);
	}

	toggleCategory(categoryId, checked) {
		this.setState((previousState) => {
			let categories = [];

			if (checked) {
				categories = [...previousState.categories, categoryId];
			} else {
				categories = previousState.categories.filter((each) => each !== categoryId);
			}

			return Object.assign({}, previousState, {
				categories
			});
		});
	}

	toggleMechanic(mechanicId, checked) {
		this.setState((previousState) => {
			let mechanics = [];

			if (checked) {
				mechanics = [...previousState.mechanics, mechanicId];
			} else {
				mechanics = previousState.mechanics.filter((each) => each !== mechanicId);
			}

			return Object.assign({}, previousState, {
				mechanics
			});
		});
	}

	renderMetaInfo({ container, state, toggleFn }) {
		let Klass = container;
		return <Klass transform={(data) => {
			if (!data || !data.length) {
				return "LOADING";
			}

			return (
				<>
					{data.map((category) => (
						<FormGroup key={category.id} check>
							<Label check>
								<Input
									checked={state.includes(category.id)}
									type="checkbox"
									onChange={({ target: { checked } }) => {
										toggleFn(category.id, checked);
									}}
								/>{" "}
								{category.value}
							</Label>
						</FormGroup>
					))}
				</>
			);
		}}/>;
	}

	renderCategories() {
		return this.renderMetaInfo({
			container: this.props.categoriesContainer,
			state: this.state.categories,
			toggleFn: this.toggleCategory.bind(this)
		});
	}

	renderMechanics() {
		return this.renderMetaInfo({
			container: this.props.mechanicsContainer,
			state: this.state.mechanics,
			toggleFn: this.toggleMechanic.bind(this)
		});
	}

	render() {
		return (
			<div className="menu">
				<form className="form" onSubmit={(event) => event.preventDefault()}>
					<FormGroup>
						<Label for="name"
							text="Name"
						>
							<Translate i18nKey="name">Name</Translate>
						</Label>
						<Input
							id="name"
							value={this.state.name}
							onChange={this.changeName.bind(this)}
						/>
					</FormGroup>
					<FormGroup>
						<Switch
							text={<Translate i18nKey="numberOfPlayers">Number of Players</Translate>}
							value={this.state.numberOfPlayersFilter}
							onChange={this.numberOfPlayersFilter.bind(this)}
						/>
						<InputRange
							disabled={!this.state.numberOfPlayersFilter}
							maxValue={10}
							minValue={1}
							value={this.state.numberOfPlayers || defaults.numberOfPlayers}
							onChange={(numberOfPlayers) => this.setState({ numberOfPlayers })}
						/>
					</FormGroup>
					<FormGroup className="age-group">
						<Switch
							text={<Translate i18nKey="age">Age</Translate>}
							value={this.state.ageFilter}
							onChange={this.ageFilter.bind(this)}
						/>
						<InputRange
							disabled={!this.state.ageFilter}
							maxValue={18}
							minValue={0}
							value={this.state.age}
							onChange={(age) => this.setState({ age })}
						/>
					</FormGroup>
					<FormGroup>
						<Switch
							text={<Translate i18nKey="showBorrowed">Show Borrowed</Translate>}
							value={this.state.showBorrowedFilter}
							onChange={this.showBorrowedFilter.bind(this)}
						/>
					</FormGroup>
					<FormGroup tag="fieldset">
						<legend><Translate i18nKey="categories">Categories</Translate></legend>
						{this.renderCategories()}
					</FormGroup>
					<FormGroup tag="fieldset">
						<legend><Translate i18nKey="mechanics">Mechanics</Translate></legend>
						{this.renderMechanics()}
					</FormGroup>
				</form>
				{this.renderActions()}
			</div>
		);
	}
}
