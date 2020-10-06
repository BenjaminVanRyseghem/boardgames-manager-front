import "./user.scss";
import { Col, Container, Row } from "reactstrap";
import GameCard from "components/gameCard/gameCard";
import info from "helpers/info";
import Loading from "components/loading/loading";
import Page from "../page";
import PropTypes from "prop-types";
import React from "react";
import Translate from "components/i18n/translate";
import UserModel from "models/user";

export class UserContainer extends React.Component {
	static propTypes = {
		data: PropTypes.object,
		error: PropTypes.object,
		user: PropTypes.object.isRequired
	};

	componentDidUpdate(prevProps) {
		if (prevProps.error !== this.props.error) {
			info.error({
				html: <Translate i18nKey="failedToLoadLocation">Failed to load location!</Translate>
			});
		}
	}

	renderDeleteButton(data) {
		let canDelete = this.props.user.canDeleteUser() && !!data.borrowedGames();

		if (!canDelete) {
			return null;
		}

		return "TODO";
		// return <DeleteLocationButton
		// 	location={data}
		// 	onDelete={() => this.props.onDeleteLocation(data)}
		// />;
	}

	renderGames(games) {
		if (!games.length) {
			return (
				<Row className="games no-game">
					<Col sm={{
						size: 6,
						offset: 3
					}}>
						<Translate i18nKey="noGameBorrowedByUser">
							No game borrowed by this user...
						</Translate>
					</Col>
				</Row>
			);
		}

		return (
			<Row className="games">
				{games.map((game) => <Col key={game.id()} className="card-holder" sm={4}>
					<GameCard game={game}/>
				</Col>)}
			</Row>
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
			<div className="user-container">
				<div className="page-title"><h1>{user.fullName()} {this.renderDeleteButton(user)}</h1></div>
				<div>
					<Translate i18nKey="role" role={user.role()}>
						Role: %role%
					</Translate>
				</div>
				<Container className="content">
					{this.renderGames(user.borrowedGames())}
				</Container>
			</div>
		);
	}
}

export default class User extends Page {
	static propTypes = {
		id: PropTypes.string.isRequired,
		user: PropTypes.object.isRequired
	};

	state = {};

	renderContent() {
		return (
			<div className="user">
				<this.swr model={UserModel} url={`/api/v1/user/${this.props.id}`}>
					<UserContainer user={this.props.user}/>
				</this.swr>
			</div>
		);
	}
}
