import "./userCard.scss";
import PropTypes from "prop-types";
import React from "react";

export default class UserCard extends React.Component {
	static defaultProps = {};

	static propTypes = {
		user: PropTypes.object.isRequired
	};

	state = {};

	render() {
		return (
			<div className="userCard">
				<div className="content">
					<div className="icon"></div>
					<div className="name">{this.props.user.fullName()}</div>
				</div>
			</div>
		);
	}
}
