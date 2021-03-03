import "./editNamesForm.scss";
import { Col, FormFeedback, FormGroup, Input, Label } from "reactstrap";
import LoadingButton from "../loadingButton/loadingButton";
import PropTypes from "prop-types";
import React from "react";
import Translate from "components/i18n/translate";

export default class EditNamesForm extends React.Component {
	static defaultProps = {
		loading: false
	};

	static propTypes = {
		currentUser: PropTypes.object.isRequired,
		loading: PropTypes.bool,
		updateUser: PropTypes.func.isRequired,
		user: PropTypes.object.isRequired
	};

	state = {};

	checkNames(prevProps) {
		if (prevProps.user?.firstName() !== this.props.user?.firstName()) {
			this.setState({
				firstName: this.props.user?.firstName(),
				firstNameError: false
			});
		}

		if (prevProps.user?.lastName() !== this.props.user?.lastName()) {
			this.setState({
				lastName: this.props.user?.lastName(),
				lastNameError: false
			});
		}
	}

	componentDidUpdate(prevProps) {
		this.checkNames(prevProps);
	}

	componentDidMount() {
		this.checkNames({});
	}

	isValid() {
		let isValid = true;

		if (this.state.firstName) {
			this.setState({ firstNameError: false });
		} else {
			this.setState({ firstNameError: true });
			isValid = false;
		}

		if (this.state.lastName) {
			this.setState({ lastNameError: false });
		} else {
			this.setState({ lastNameError: true });
			isValid = false;
		}

		return isValid;
	}

	canEditUser() {
		return this.props.currentUser.canEditUser();
	}

	updateUser() {
		let valid = this.isValid();
		if (!valid) {
			return;
		}

		this.props.updateUser({
			firstName: this.state.firstName,
			lastName: this.state.lastName
		});
	}

	render() {
		return (
			<>
				<FormGroup row>
					<Label for="role" md={2} sm={4}>
						<Translate i18nKey="user.firstName">First name</Translate>
					</Label>
					<Col md={10} sm={8}>
						<Input
							disabled={!this.canEditUser()}
							id="role"
							invalid={this.state.firstNameError}
							name="role"
							value={this.state.firstName}
							onChange={({ target: { value: firstName } }) => this.setState({ firstName })}
						/>
						<FormFeedback>
							<Translate i18nKey="user.firstNameError">Empty first name</Translate>
						</FormFeedback>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Label for="role" md={2} sm={4}>
						<Translate i18nKey="user.lastName">Last name</Translate>
					</Label>
					<Col md={10} sm={8}>
						<Input
							disabled={!this.canEditUser()}
							id="role"
							invalid={this.state.lastNameError}
							name="role"
							value={this.state.lastName}
							onChange={({ target: { value: lastName } }) => this.setState({ lastName })}
						/>
						<FormFeedback>
							<Translate i18nKey="user.lastNameError">Empty last name</Translate>
						</FormFeedback>
					</Col>
				</FormGroup>
				<FormGroup row>
					{this.canEditUser() && <Col md={2} sm={4}>
						<LoadingButton
							color="primary"
							loading={this.props.loading}
							onClick={(event) => {
								event.preventDefault();
								this.updateUser();
							}}
						>
							<Translate i18nKey="user.update">Update</Translate>
						</LoadingButton>
					</Col>}
				</FormGroup>
			</>
		);
	}
}
