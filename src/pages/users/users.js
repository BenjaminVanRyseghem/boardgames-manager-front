// eslint-disable-line max-lines
import "./users.scss";
import {
	Button,
	Col,
	Container,
	Form, FormFeedback,
	FormGroup, Input,
	Label,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Row
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import i18n from "i18n/i18n";
import info from "helpers/info";
import Loading from "components/loading/loading";
import Page from "../page";
import PropTypes from "prop-types";
import React from "react";
import Select from "react-select";
import Translate from "components/i18n/translate";
import User from "models/user";
import UserCard from "components/userCard/userCard";

const defaultRole = {
	id: "user",
	name: "User"
};

const roles = [
	{
		id: "admin",
		name: "Admin"
	},
	defaultRole,
	{
		id: "borrower",
		name: "Borrower"
	}
];

export class UsersContainer extends React.Component {
	static defaultProps = {
		data: undefined,
		error: undefined
	}

	static propTypes = {
		currentUser: PropTypes.object.isRequired,
		data: PropTypes.array,
		dataMutate: PropTypes.func,
		error: PropTypes.object,
		onCreate: PropTypes.func.isRequired
	};

	state = {
		open: false,
		role: defaultRole,
		firstName: "",
		firstNameError: false,
		lastName: "",
		lastNameError: false,
		email: "",
		emailError: false,
		password: "",
		passwordError: false
	};

	componentDidUpdate(prevProps) {
		if (prevProps.error !== this.props.error) {
			info.error({
				html: <Translate i18nKey="failedToLoadUsers">Failed to load users!</Translate>
			});
		}
	}

	toggleModal() {
		this.setState((state) => ({
			open: !state.open
		}));
	}

	isValid() { // eslint-disable-line max-statements
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

	onCreate() {
		if (!this.isValid()) {
			return;
		}

		this.setState({ open: false });

		this.props.onCreate({
			email: this.state.email,
			firstName: this.state.firstName,
			lastName: this.state.lastName,
			password: this.state.password,
			role: this.state.role.id
		}, this.props.dataMutate);
	}

	renderAddUserModal() {
		let toggle = this.toggleModal.bind(this);

		return (
			<Modal className="add-user-modal" isOpen={this.state.open} toggle={toggle}>
				<ModalHeader toggle={toggle}>
					<Translate i18nKey="addAUser">Add a user</Translate>
				</ModalHeader>
				<ModalBody>
					<Form>
						<FormGroup>
							<Label>
								<Translate i18nKey="user.role">Role</Translate>
							</Label>
							<Select
								className="locations-select"
								formatOptionLabel={(option) => option.name}
								getOptionLabel={(option) => option.name}
								getOptionValue={(option) => option.id}
								options={roles}
								placeholder={i18n.t("placeholder", "Select...")}
								value={this.state.role}
								onChange={(role) => this.setState({ role })}
							/>
						</FormGroup>
						<FormGroup>
							<Label>
								<Translate i18nKey="user.email">Email</Translate>
							</Label>
							<Input
								invalid={this.state.emailError}
								value={this.state.email}
								onChange={({ target: { value: email } }) => this.setState({ email })}
							/>
							<FormFeedback>
								<Translate i18nKey="user.emailError">Empty email</Translate>
							</FormFeedback>
						</FormGroup>
						<FormGroup>
							<Label>
								<Translate i18nKey="user.password">Password</Translate>
							</Label>
							<Input
								invalid={this.state.passwordError}
								type="password"
								value={this.state.password}
								onChange={({ target: { value: password } }) => this.setState({ password })}
							/>
							<FormFeedback>
								<Translate i18nKey="user.passwordError">Empty password</Translate>
							</FormFeedback>
						</FormGroup>
						<FormGroup>
							<Label>
								<Translate i18nKey="user.firstName">First name</Translate>
							</Label>
							<Input
								invalid={this.state.firstNameError}
								value={this.state.firstName}
								onChange={({ target: { value: firstName } }) => this.setState({ firstName })}
							/>
							<FormFeedback>
								<Translate i18nKey="user.firstNameError">Empty first name</Translate>
							</FormFeedback>
						</FormGroup>
						<FormGroup>
							<Label>
								<Translate i18nKey="user.lastName">Last name</Translate>
							</Label>
							<Input
								invalid={this.state.lastNameError}
								value={this.state.lastName}
								onChange={({ target: { value: lastName } }) => this.setState({ lastName })}
							/>
							<FormFeedback>
								<Translate i18nKey="user.lastNameError">Empty last name</Translate>
							</FormFeedback>
						</FormGroup>
					</Form>
				</ModalBody>
				<ModalFooter>
					<Button color="primary" onClick={() => {
						this.onCreate();
					}}>
						<Translate i18nKey="addAUser">Add a user</Translate>
					</Button>{" "}
					<Button color="secondary" onClick={toggle}><Translate i18nKey="cancel">Cancel</Translate></Button>
				</ModalFooter>
			</Modal>
		);
	}

	renderAddUser() {
		if (!this.props.currentUser.canAddUsers()) {
			return null;
		}

		return (
			<>
				{this.renderAddUserModal()}
				<Col key="add-user" className="card-holder" sm={4}>
					<div className="userCard" onClick={this.toggleModal.bind(this)}>
						<div className="content-wrapper">
							<div className="content-inner-wrapper">
								<div className="content">
									<div className="icon-wrapper">
										<FontAwesomeIcon className="icon" icon="plus"/>
									</div>
									<div className="name">
										<Translate i18nKey="addAUser">Add a user</Translate>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Col>
			</>
		);
	}

	render() {
		let { data, error } = this.props;

		if (error) {
			return null;
		}
		if (!data) {
			return <div><Loading/></div>;
		}

		if (!data.length) {
			return (
				<Container className="content">
					<Row className="users">
						<div className="no-user"><Translate i18nKey="noUserFound">No user found!</Translate>
						</div>
					</Row>
				</Container>
			);
		}

		return (
			<Container className="content">
				<Row className="users">
					{this.renderAddUser()}
					{data
						.sort(User.sortAlphabetically)
						.map((datum) => <Col key={datum.id()} className="card-holder" sm={4}>
							<UserCard currentUser={this.props.currentUser} user={datum}/>
						</Col>)}
				</Row>
			</Container>
		);
	}
}

export default class Users extends Page {
	static defaultProps = {};

	static propTypes = {
		user: PropTypes.object.isRequired
	};

	state = {};

	title = <Translate i18nKey="users">Users</Translate>;

	onCreate(body, dataMutate) {
		return this.fetch("/api/v1/user", {
			method: "POST",
			body
		})
			.then((data) => {
				info.success({
					title: <Translate i18nKey="info.success">Success</Translate>,
					html: <Translate i18nKey="user.userCreatedSuccessfully">
						{"User successfully created"}
					</Translate>,
					onAfterClose: () => dataMutate(data)
				});
			})
			.catch(() => {
				info.error({
					html: <Translate i18nKey="user.failedToCreateUser">Failed to create user!</Translate>
				});
			});
	}

	renderContent() {
		return (
			<div className="usersContainer">
				<this.swr model={User} url="/api/v1/user">
					<UsersContainer
						currentUser={this.props.user}
						onCreate={this.onCreate.bind(this)}
					/>
				</this.swr>
			</div>
		);
	}
}
