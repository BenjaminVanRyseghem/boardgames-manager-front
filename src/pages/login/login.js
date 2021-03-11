import "./login.scss";
import { Col, Container, Row } from "reactstrap";
import CurrentUser from "models/currentUser";
import info from "helpers/info";
import LoginForm from "components/loginForm/loginForm";
import Page from "../page";
import React from "react";
import { Redirect } from "react-router";
import ServerError from "models/serverError";

export default class Login extends Page {
	state = {
		error: null,
		loading: false,
		logged: false
	};

	canHandleError(error) {
		return !!(error && error.type && error.type === ServerError.type && error.error.type === "AuthenticationError");
	}

	login({ username, password }) {
		let { setUser } = this.props;
		let from = this.props.location && this.props.location.state && this.props.location.state.from;
		this.setState({
			loading: true,
			error: null
		}, () => {
			this.fetch("/api/v1/user/login", {
				method: "POST",
				body: {
					username,
					password
				}
			})
				.then((userData) => {
					let user = new CurrentUser(userData);
					setUser(user, from || "/");
				})
				.catch((error) => {
					this.setState({
						error,
						loading: false
					});
				});
		});
	}

	signIn({ username, password }) {
		this.setState({
			loading: true,
			error: null
		}, () => {
			this.fetch("/api/user", {
				method: "POST",
				body: {
					id: username,
					password
				}
			})
				.then(() => {
					this.setState({
						logged: true
					});
				})
				.catch((error) => {
					this.setState({
						error,
						loading: false
					});
				});
		});
	}

	componentDidUpdate(previousProps, previousState) {
		if (!previousState.error &&
			this.state.error &&
			!this.canHandleError(this.state.error)) {
			info.error();
		}
	}

	renderContent(invalid) {
		return (
			<LoginForm
				invalid={invalid}
				loading={this.state.loading}
				onSubmit={this.login.bind(this)}
			/>
		);
	}

	render() {
		if (this.state.logged) {
			debugger;
			return (
				<Redirect to={(this.props.location.state && this.props.location.state.from) || "/"}/>
			);
		}

		let invalid = this.canHandleError(this.state.error);

		return (
			<div className="page login">
				<Container>
					<Row>
						<Col lg={{
							size: 6,
							offset: 3
						}} md="12">
							<div className="form-container">
								<div className="form-wrapper">
									{this.renderContent(invalid)}
								</div>
							</div>
						</Col>
					</Row>
				</Container>
			</div>
		);
	}
}
