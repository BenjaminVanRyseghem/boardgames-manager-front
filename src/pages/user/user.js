// eslint-disable-line max-lines
import "./user.scss";
import {
	Button,
	Col,
	Container,
	Form, FormFeedback,
	FormGroup,
	Input,
	Label,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader
} from "reactstrap";
import DeleteUserButton from "components/deleteUserButton/deleteUserButton";
import EditNamesForm from "components/editNamesForm/editNamesForm";
import GameCard from "components/gameCard/gameCard";
import info from "helpers/info";
import Loading from "components/loading/loading";
import LoadingButton from "components/loadingButton/loadingButton";
import Page from "../page";
import PropTypes from "prop-types";
import React from "react";
import { Redirect } from "react-router";
import Translate from "components/i18n/translate";
import UserModel from "models/user";

export class UserContainer extends React.Component {
	static propTypes = {
		convertToRegularUser: PropTypes.func.isRequired,
		data: PropTypes.object,
		dataMutate: PropTypes.func,
		error: PropTypes.object,
		onDeleteUser: PropTypes.func.isRequired,
		updateUser: PropTypes.func.isRequired,
		user: PropTypes.object.isRequired
	};

	state = {
		firstName: "",
		firstNameError: false,
		lastName: "",
		lastNameError: false,
		loading: false
	}

	componentDidUpdate(prevProps) {
		if (prevProps.error !== this.props.error) {
			info.error({
				html: <Translate i18nKey="user.failedToLoadUser">Failed to load user!</Translate>
			});
		}
	}

	canBeConverted() {
		if (this.props.user.role() !== "admin") {
			return false;
		}

		return this.props.data.role() === "borrower";
	}

	updateUser(data) {
		this.setState({ loading: true });
		this.props.updateUser(data, this.props.dataMutate)
			.finally(() => this.setState({ loading: false }));
	}

	renderDeleteButton(user) {
		let canDelete = this.props.user.canDeleteUser() &&
			!!user.borrowedGames() &&
			user.id() !== this.props.user.id();

		if (!canDelete) {
			return null;
		}

		return <DeleteUserButton
			user={user}
			onDelete={() => this.props.onDeleteUser(user)}
		/>;
	}

	renderGames(games) {
		if (!games.length) {
			return null;
		}

		return (
			<div className="games">
				{games.map((game) => <div key={game.id()} className="card-holder">
					<GameCard game={game}/>
				</div>)}
			</div>
		);
	}

	renderRole() {
		let { data: user } = this.props;

		return (
			<Form>
				<FormGroup row>
					<Label for="role" md={2} sm={4}>
						<Translate i18nKey="user.role">Role</Translate>
					</Label>
					<Col md={10} sm={8}>
						<Input disabled id="role" name="role" value={user.role()}/>
					</Col>
				</FormGroup>
				{user.role() && user.role() !== "borrower" && <FormGroup row>
					<Label for="email" md={2} sm={4}>
						<Translate i18nKey="user.email">Email</Translate>
					</Label>
					<Col md={10} sm={8}>
						<Input disabled id="email" name="email" value={user.id()}/>
					</Col>
				</FormGroup>}
				<FormGroup row>
					{this.canBeConverted() && <Col md={2} sm={4}>
						<Button
							color="primary"
							onClick={(event) => {
								event.preventDefault();
								this.props.convertToRegularUser();
							}}
						>
							<Translate i18nKey="user.convertToRegularUser">Convert to user</Translate>
						</Button>
					</Col>}
				</FormGroup>
			</Form>
		);
	}

	render() {
		let { data: user, error } = this.props;

		if (error) {
			return null;
		}
		if (user === null) {
			return <div><Translate i18nKey="noUserFound">No user found!</Translate></div>;
		}

		if (!user) {
			return <div><Loading/></div>;
		}

		return (
			<Container className="user-container">
				<div className="page-title"><h1>{user.fullName()} {this.renderDeleteButton(user)}</h1></div>
				{this.renderRole()}
				<Form>
					<EditNamesForm
						currentUser={this.props.user}
						loading={this.state.loading}
						updateUser={this.updateUser.bind(this)}
						user={this.props.data}
					/>
				</Form>
				<div className="content">
					{this.renderGames(user.borrowedGames())}
				</div>
			</Container>
		);
	}
}

export default class User extends Page {
	static propTypes = {
		id: PropTypes.string.isRequired,
		user: PropTypes.object.isRequired
	};

	static key = "user";

	state = {
		confirmError: false,
		confirmPassword: "",
		email: "",
		emailError: false,
		loading: false,
		open: false,
		password: "",
		passwordError: false,
		redirect: false
	};

	onDeleteUser() {
		// TO DO
	}

	convertToRegularUser() {
		this.setState({ open: true });
	}

	updateUser(data, dataMutate) {
		return this.fetch(`/api/v1/user/${this.props.id}`, {
			method: "PUT",
			body: data
		})
			.then((user) => {
				dataMutate(user);
				info.success({
					title: <Translate i18nKey="info.success">Success</Translate>,
					html: <Translate i18nKey="user.updateDoneSuccessfully">
						{"Update successfully done"}
					</Translate>
				});
			})
			.catch(() => {
				info.error({
					html: <Translate i18nKey="user.failedToUpdateUser">Failed to update user!</Translate>
				});
			})
			.finally(() => {
				this.setState({
					loading: false
				});
			});
	}

	toggle() {
		this.setState((state) => ({ open: !state.open }));
	}

	isValid() {
		let isValid = true;

		if (this.state.email) {
			this.setState({ emailError: false });
		} else {
			this.setState({ emailError: true });
			isValid = false;
		}

		if (this.state.password) {
			this.setState({ passwordError: false });
		} else {
			this.setState({ passwordError: true });
			isValid = false;
		}

		if (this.state.password === this.state.confirmPassword) {
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

		this.fetch("/api/v1/user/convertToRegularUser", {
			method: "POST",
			body: {
				id: this.props.id,
				password: this.state.password,
				email: this.state.email
			}
		})
			.then(() => {
				info.success({
					title: <Translate i18nKey="info.success">Success</Translate>,
					html: <Translate i18nKey="user.conversionDoneSuccessfully">
						{"Conversion successfully done"}
					</Translate>,
					onAfterClose: () => this.setState({ redirect: this.state.email })
				});
			})
			.catch((data) => {
				if (data.error && data.error.status === 401) {
					this.setState({ invalidPassword: true });
				} else {
					info.error({
						html: <Translate i18nKey="user.failedToConvertUser">Failed to convert user!</Translate>
					});
				}
			})
			.finally(() => {
				this.setState({
					loading: false,
					open: false
				});
			});
	}

	renderModal() {
		let toggle = this.toggle.bind(this);

		return (
			<Modal isOpen={this.state.open} toggle={toggle}>
				<ModalHeader toggle={toggle}>Modal title</ModalHeader>
				<ModalBody>
					<Form onSubmit={(event) => event.preventDefault()}>
						<FormGroup row>
							<Label
								for="email"
								md={4}
								sm={6}
							>
								<Translate i18nKey="user.email">Email</Translate>
							</Label>
							<Col md={8} sm={6}>
								<Input
									id="email"
									invalid={this.state.emailError}
									name="email"
									value={this.state.email}
									onChange={({ target: { value: email } }) => {
										this.setState({ email });
									}}
								/>
								<FormFeedback>
									<Translate i18nKey="user.emailError">Empty email</Translate>
								</FormFeedback>
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label
								for="password"
								md={4}
								sm={6}
							>
								<Translate i18nKey="user.password">Password</Translate>
							</Label>
							<Col md={8} sm={6}>
								<Input
									id="password"
									invalid={this.state.passwordError}
									name="password"
									type="password"
									value={this.state.password}
									onChange={({ target: { value: password } }) => {
										this.setState({ password });
									}}
								/>
								<FormFeedback>
									<Translate i18nKey="user.passwordError">Empty password</Translate>
								</FormFeedback>
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label
								for="confirmPassword"
								md={4}
								sm={6}
							>
								<Translate i18nKey="user.confirmPassword">Confirm password</Translate>
							</Label>
							<Col md={8} sm={6}>
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
									<Translate i18nKey="user.confirmPasswordError">Password mismatch</Translate>
								</FormFeedback>
							</Col>
						</FormGroup>
					</Form>
				</ModalBody>
				<ModalFooter>
					<LoadingButton
						color="primary"
						loading={this.state.loading}
						onClick={this.onSubmit.bind(this)}
					>
						<Translate i18nKey="user.convert">Convert</Translate>
					</LoadingButton>{" "}
					<Button color="secondary" onClick={toggle}>
						<Translate i18nKey="user.cancel">Cancel</Translate>
					</Button>
				</ModalFooter>
			</Modal>
		);
	}

	renderContent() {
		if (this.state.redirect) {
			return <Redirect to={`/user/${this.state.redirect}`}/>;
		}

		return (
			<div key={this.props.id}>
				{this.renderModal()}
				<this.swr model={UserModel} url={`/api/v1/user/${this.props.id}`}>
					<UserContainer
						convertToRegularUser={this.convertToRegularUser.bind(this)}
						updateUser={this.updateUser.bind(this)}
						user={this.props.user}
						onDeleteUser={this.onDeleteUser.bind(this)}
					/>
				</this.swr>
			</div>
		);
	}
}
