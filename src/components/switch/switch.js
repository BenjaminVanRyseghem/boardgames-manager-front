import "./switch.scss";
import { Toggle } from "react-toggle-component";
import { Label } from "reactstrap";
import PropTypes from "prop-types";
import React from "react";

export default class Switch extends React.Component {
	static propTypes = {
		onChange: PropTypes.func.isRequired,
		text: PropTypes.string.isRequired,
		value: PropTypes.bool.isRequired
	};

	render() {
		return (
			<div className="switch">
				<Label htmlFor="toggle-2">
					<Toggle
						checked={this.props.value}
						knobRadius="2px"
						name="toggle-2"
						radius="3px"
						radiusBackground="2px"
						onToggle={this.props.onChange}
					/>
					{this.props.text}
				</Label>
			</div>
		);
	}
}
