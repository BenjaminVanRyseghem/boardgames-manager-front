import "./userCard.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";

export default class UserCard extends React.Component {
	static defaultProps = {};

	static propTypes = {
		user: PropTypes.object.isRequired
	};

	state = {};

	renderCounter() {
		let count = this.props.user.numberOfBorrowedGames();
		if (!count) {
			return null;
		}

		return (
			<div className="counter">{count}</div>
		);
	}

	render() {
		return (
			<div className="userCard">
				<Link to={`/user/${this.props.user.id()}`}>
					<div className="content-wrapper">
						<div className="content-inner-wrapper">
							<div className="content">
								<div className="icon-wrapper">
									{this.renderCounter()}
									<FontAwesomeIcon className="icon" icon="user"/>
								</div>
								<div className="name">{this.props.user.fullName()}</div>
							</div>
						</div>
					</div>
				</Link>
			</div>
		);
	}
}
