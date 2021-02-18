import "./loginForm.scss";
import { Alert, Form, FormGroup, Input, Label } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingButton from "components/loadingButton/loadingButton";
import PropTypes from "prop-types";
import React from "react";
import Translate from "../i18n/translate";

export default class LoginForm extends React.Component {
	static defaultProps = {
		invalid: false,
		loading: false
	};

	static propTypes = {
		invalid: PropTypes.bool,

		/**
		 * True when the form is currently loading
		 */
		loading: PropTypes.bool,
		onSubmit: PropTypes.func.isRequired
	};

	state = {
		username: "",
		password: ""
	};

	onSubmit(event) {
		event.preventDefault();

		this.props.onSubmit({
			username: this.state.username,
			password: this.state.password
		});
	}

	renderError(invalid) {
		if (!invalid) {
			return null;
		}

		return (
			<Alert color="danger">
				<FontAwesomeIcon className="icon" icon="exclamation-triangle"/>
				User not found
			</Alert>
		);
	}

	render() {
		return (
			<Form
				className="loginForm"
				onSubmit={this.onSubmit.bind(this)}
			>
				<FormGroup>
					<Label for="email"><Translate i18nKey="login.email">Email</Translate></Label>
					<Input
						autoFocus
						id="email"
						invalid={this.props.invalid}
						value={this.state.username}
						onChange={(event) => this.setState({ username: event.target.value })}
					/>
				</FormGroup>
				<FormGroup>
					<Label for="password"><Translate i18nKey="login.password">Password</Translate></Label>
					<Input
						id="password"
						invalid={this.props.invalid}
						type="password"
						value={this.state.password}
						onChange={(event) => this.setState({ password: event.target.value })}
					/>
				</FormGroup>
				{this.renderError(this.props.invalid)}
				<div className="actions">
					<LoadingButton color="primary" loading={this.props.loading}>
						<Translate i18nKey="login.submit">Submit</Translate>
					</LoadingButton>
				</div>
			</Form>
		);
	}
}
