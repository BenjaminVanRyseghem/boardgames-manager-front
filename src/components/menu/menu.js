import "./menu.scss";
import { FormGroup } from "reactstrap";
import InputRange from "react-input-range";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";
import Switch from "components/switch/switch";

const DELAY = 500;
const updatableKeys = ["numberOfPlayers", "name"];
const defaults = {
	name: "",
	numberOfPlayers: 2
};

export default class Menu extends React.Component {
	static propTypes = {
		setGameFilters: PropTypes.func.isRequired
	};

	constructor(...args) {
		super(...args);

		this.timeout = null;

		this.state = {
			numberOfPlayers: null,
			name: null,
			numberOfPlayersFilter: false
		};
	}

	buildFilters() {
		let result = {};
		updatableKeys.forEach((name) => {
			let state = this.getStateFor(name);
			if (state === null) {
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
		this.setState({ name: event.target.value || false });
	}

	numberOfPlayersFilter({ target: { checked: numberOfPlayersFilter } }) {
		this.setState({ numberOfPlayersFilter });
	}

	render() {
		return (
			<div className="menu">
				<form className="form">
					<FormGroup>
						<Switch
							text="Number of Players"
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
				</form>
				<div className="action">
					<div>
						<Link to="/add">Add</Link>
					</div>
				</div>
			</div>
		);
	}
}
