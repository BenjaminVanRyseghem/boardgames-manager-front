import "./users.scss";
import { Col, Container, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import info from "helpers/info";
import { Link } from "react-router-dom";
import Loading from "components/loading/loading";
import Page from "../page";
import PropTypes from "prop-types";
import React from "react";
import Translate from "components/i18n/translate";
import User from "models/user";
import UserCard from "components/userCard/userCard";

export class UsersContainer extends React.Component {
	static defaultProps = {
		data: undefined,
		error: undefined
	}

	static propTypes = {
		currentUser: PropTypes.object.isRequired,
		data: PropTypes.array,
		error: PropTypes.object
	};

	componentDidUpdate(prevProps) {
		if (prevProps.error !== this.props.error) {
			info.error({
				html: <Translate i18nKey="failedToLoadLocations">Failed to load users!</Translate>
			});
		}
	}

	renderAddUser() {
		return (
			<Col key="add-user" className="card-holder" sm={4}>
				<div className="userCard">
					<Link className="add-user" to="/add-user">
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
					</Link>
				</div>
			</Col>
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

	renderContent() {
		return (
			<div className="usersContainer">
				<this.swr model={User} url="/api/v1/user">
					<UsersContainer currentUser={this.props.user}/>
				</this.swr>
			</div>
		);
	}
}
