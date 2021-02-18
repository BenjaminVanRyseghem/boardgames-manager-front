import "./account.scss";
import { Button, Col, Container, Form, FormFeedback, FormGroup, Input, Label } from "reactstrap";
import info from "helpers/info";
import LoadingButton from "components/loadingButton/loadingButton";
import Page from "../page";
import PropTypes from "prop-types";
import React from "react";
import Translate from "components/i18n/translate";

export default class Account extends Page {
	static defaultProps = {};

	static propTypes = {
		logout: PropTypes.func.isRequired,
		user: PropTypes.object.isRequired
	};

	state = {
		currentError: false,
		newError: false,
		confirmError: false,
		invalidPassword: false,
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
		loading: false
	};

	title() {
		return this.props.user.fullName();
	}

	isValid() {
		let isValid = true;

		if (this.state.currentPassword) {
			this.setState({ currentError: false });
		} else {
			this.setState({ currentError: true });
			isValid = false;
		}

		if (this.state.newPassword) {
			this.setState({ newError: false });
		} else {
			this.setState({ newError: true });
			isValid = false;
		}

		if (this.state.newPassword === this.state.confirmPassword) {
			this.setState({ confirmError: false });
		} else {
			this.setState({ confirmError: true });
			isValid = false;
		}

		return isValid;
	}

	onSubmit() {
		if (!this.isValid()) {
			return;
		}

		this.setState({
			invalidPassword: false,
			loading: true
		});

		this.fetch(`/api/v1/user/${this.props.user.id()}`, {
			method: "PUT",
			body: {
				currentPassword: this.state.currentPassword,
				newPassword: this.state.newPassword
			}
		})
			.then(() => {
				info.success({
					title: <Translate i18nKey="info.success">Success</Translate>,
					html: <Translate i18nKey="account.passwordChangedSuccessfully">
						{"Password successfully changed"}
					</Translate>,
					onAfterClose: () => this.props.logout()
				});
			})
			.catch((data) => {
				if (data.error && data.error.status === 401) {
					this.setState({ invalidPassword: true });
				} else {
					info.error({
						html: <Translate i18nKey="account.failedToChangePassword">Failed to change password!</Translate>
					});
				}
			})
			.finally(() => {
				this.setState({ loading: false });
			});
	}

	renderContent() {
		return (
			<div className="account">
				<Container>
					<Form>
						<FormGroup row>
							<Label for="role" md={2} sm={4}><Translate i18nKey="account.role">Role</Translate></Label>
							<Col md={10} sm={8}>
								<Input disabled id="role" name="role" value={this.props.user.role()}/>
							</Col>
						</FormGroup>
						<FormGroup row>
							<Col md={2} sm={4}>
								<Button
									color="danger"
									onClick={(event) => {
										event.preventDefault();
										this.props.logout();
									}}
								>
									<Translate i18nKey="account.logout">Log out</Translate>
								</Button>
							</Col>
						</FormGroup>
						<Label className="section">
							<Translate i18nKey="account.changePassword">Change password</Translate>
						</Label>
						<FormGroup row>
							<Label
								for="currentPassword"
								md={2}
								sm={4}
							>
								<Translate i18nKey="account.currentPassword">Current password</Translate>
							</Label>
							<Col md={10} sm={8}>
								<Input
									id="currentPassword"
									invalid={this.state.currentError || this.state.invalidPassword}
									name="currentPassword"
									type="password"
									value={this.state.currentPassword}
									onChange={({ target: { value: currentPassword } }) => {
										this.setState({ currentPassword });
									}}
								/>
								<FormFeedback>
									{this.state.currentError
										? <Translate i18nKey="account.currentPasswordError">Empty password</Translate>
										: <Translate i18nKey="account.invalidPasswordError">Invalid password</Translate>
									}
								</FormFeedback>
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label
								for="newPassword"
								md={2}
								sm={4}
							>
								<Translate i18nKey="account.newPassword">New password</Translate>
							</Label>
							<Col md={10} sm={8}>
								<Input
									id="newPassword"
									invalid={this.state.newError}
									name="newPassword"
									type="password"
									value={this.state.newPassword}
									onChange={({ target: { value: newPassword } }) => {
										this.setState({ newPassword });
									}}
								/>
								<FormFeedback>
									<Translate i18nKey="account.newPasswordError">Empty password</Translate>
								</FormFeedback>
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label
								for="confirmPassword"
								md={2}
								sm={4}
							>
								<Translate i18nKey="account.confirmPassword">Confirm password</Translate>
							</Label>
							<Col md={10} sm={8}>
								<Input
									id="confirmPassword"
									invalid={this.state.confirmError}
									name="confirmPassword"
									type="password"
									value={this.state.confirmPassword}
									onChange={({ target: { value: confirmPassword } }) => {
										this.setState({ confirmPassword });
									}}
								/>
								<FormFeedback>
									<Translate i18nKey="account.confirmPasswordError">Password mismatch</Translate>
								</FormFeedback>
							</Col>
						</FormGroup>
						<FormGroup row>
							<Col md={2} sm={4}>
								<LoadingButton
									color="primary"
									loading={this.state.loading}
									onClick={(event) => {
										event.preventDefault();
										this.onSubmit();
									}}
								>
									<Translate i18nKey="account.submit">Submit</Translate>
								</LoadingButton>
							</Col>
						</FormGroup>
					</Form>
				</Container>
			</div>
		);
	}
}
