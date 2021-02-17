// eslint-disable-next-line max-lines
import "./menu.scss";
import { FormGroup, Input, Label } from "reactstrap";
import InputRange from "react-input-range";
import Loading from "components/loading/loading";
import PropTypes from "prop-types";
import React from "react";
import Switch from "components/switch/switch";
import Translate from "components/i18n/translate";

const DELAY = 500;

const updatableKeys = [
	"age",
	"categories",
	"mechanics",
	"name",
	"numberOfPlayers",
	"publishers",
	"showBorrowed",
	"showExpansions"
];

const defaults = {
	name: "",
	numberOfPlayers: 2,
	showExpansions: 0
};

const defaultState = {
	age: 18,
	ageFilter: false,
	categories: [],
	categoriesFilter: true,
	mechanics: [],
	mechanicsFilter: true,
	name: "",
	nameFilter: true,
	numberOfPlayers: null,
	numberOfPlayersFilter: false,
	publishers: [],
	publishersFilter: true,
	showBorrowed: 1,
	showBorrowedFilter: false,
	showExpansions: 0,
	showExpansionsFilter: true
};

export default class Menu extends React.Component {
	static defaultProps = {
		filters: {}
	};

	static propTypes = {
		categoriesContainer: PropTypes.node.isRequired,
		filters: PropTypes.object,
		mechanicsContainer: PropTypes.node.isRequired,
		publishersContainer: PropTypes.node.isRequired,
		setGameFilters: PropTypes.func.isRequired
	};

	timeout = null;

	constructor(...args) {
		super(...args);

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

	showExpansionsFilter({ target: { checked: showExpansions } }) {
		this.setState({ showExpansions: showExpansions ? 1 : 0 });
	}

	ageFilter({ target: { checked: ageFilter } }) {
		this.setState({ ageFilter });
	}

	renderActions() {
		let actions = [];

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

	togglePublisher(publisherId, checked) {
		this.setState((previousState) => {
			let publishers = [];

			if (checked) {
				publishers = [...previousState.publishers, publisherId];
			} else {
				publishers = previousState.publishers.filter((each) => each !== publisherId);
			}

			return Object.assign({}, previousState, {
				publishers
			});
		});
	}

	renderMetaInfo({ container, state, toggleFn }) {
		let transform = (data) => {
			if (!data || !data.length) {
				return <Loading/>;
			}

			return data.map((category) => (
				<FormGroup key={category.id()} check>
					<Label check>
						<Input
							checked={state.includes(category.id())}
							type="checkbox"
							onChange={({ target: { checked } }) => {
								toggleFn(category.id(), checked);
							}}
						/>{" "}
						{category.name()}
					</Label>
				</FormGroup>
			));
		};

		return React.cloneElement(container, { transform });
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

	renderPublishers() {
		return this.renderMetaInfo({
			container: this.props.publishersContainer,
			state: this.state.publishers,
			toggleFn: this.togglePublisher.bind(this)
		});
	}

	render() {
		return (
			<div className="menu">
				<form className="form" onSubmit={(event) => event.preventDefault()}>
					<FormGroup>
						<Label for="name" text="Name"><Translate i18nKey="name">Name</Translate></Label>
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
					<FormGroup>
						<Switch
							text={<Translate i18nKey="showExpansions">Show Expansions</Translate>}
							value={!!this.state.showExpansions}
							onChange={this.showExpansionsFilter.bind(this)}
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
					<FormGroup tag="fieldset">
						<legend><Translate i18nKey="publishers">Publishers</Translate></legend>
						{this.renderPublishers()}
					</FormGroup>
				</form>
				{this.renderActions()}
			</div>
		);
	}
}
