import "./userKindSwitcher.scss";
import { Form, FormGroup, Input, Label } from "reactstrap";
import PropTypes from "prop-types";
import React from "react";
import { roles } from "models/accessControl";
import User from "models/user";

export default class UserKindSwitcher extends React.Component {
	static defaultProps = {};

	static propTypes = {
		setUser: PropTypes.func.isRequired,
		user: PropTypes.object.isRequired
	};

	state = {};

	setRole({ target: { value: role } }) {
		let user = User.from(this.props.user, { role });
		this.props.setUser(user);
	}

	render() {
		return (
			<div className="userKindSwitcher">
				<Form inline>
					<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
						<Label className="mr-sm-2" for="examplePassword">User role:</Label>
						<Input
							id="examplePassword"
							type="select"
							value={this.props.user.role()}
							onChange={this.setRole.bind(this)}
						>
							<option value={roles.admin}>Admin</option>
							<option value={roles.user}>User</option>
							<option value={roles.borrower}>Borrower</option>
						</Input>
					</FormGroup>
				</Form>
			</div>
		);
	}
}
