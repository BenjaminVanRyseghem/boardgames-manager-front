import "./users.scss";
import { Col, Container, Row } from "reactstrap";
import info from "helpers/info";
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
					{data.map((datum) => <Col key={datum.id} className="card-holder" sm={4}>
						<UserCard user={new User(datum)}/>
					</Col>)}
				</Row>
			</Container>
		);
	}
}

export default class Users extends Page {
	static defaultProps = {};

	static propTypes = {};

	state = {};

	title = <Translate i18nKey="users">Users</Translate>;

	renderContent() {
		return (
			<div className="usersContainer">
				<this.swr url="/api/v1/user">
					<UsersContainer/>
				</this.swr>
			</div>
		);
	}
}
