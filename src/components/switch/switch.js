import "./switch.scss";
import { Label } from "reactstrap";
import PropTypes from "prop-types";
import React from "react";
import { Toggle } from "react-toggle-component";

const nextName = (() => {
	let id = 0;
	return () => `switch-${id++}`;
})();

export default class Switch extends React.Component {
	static propTypes = {
		onChange: PropTypes.func.isRequired,
		text: PropTypes.node.isRequired,
		value: PropTypes.bool.isRequired
	};

	render() {
		let name = nextName();
		return (
			<div className="switch">
				<Label className="switch-container" htmlFor={name}>
					<Toggle
						checked={this.props.value}
						knobRadius="2px"
						name={name}
						radius="3px"
						radiusBackground="2px"
						onToggle={this.props.onChange}
					/>
					<div className="switch-content">{this.props.text}</div>
				</Label>
			</div>
		);
	}
}
