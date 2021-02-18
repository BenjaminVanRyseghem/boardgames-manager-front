import "./user.scss";
import DeleteUserButton from "components/deleteUserButton/deleteUserButton";
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
		onDeleteUser: PropTypes.func.isRequired,
		user: PropTypes.object.isRequired
	};

	componentDidUpdate(prevProps) {
		if (prevProps.error !== this.props.error) {
			info.error({
				html: <Translate i18nKey="failedToLoadLocation">Failed to load location!</Translate>
			});
		}
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
			return (
				<div className="games no-game">
					<div>
						<Translate i18nKey="noGameBorrowedByUser">
							No game borrowed by this user...
						</Translate>
					</div>
				</div>
			);
		}

		return (
			<div className="games">
				{games.map((game) => <div key={game.id()} className="card-holder">
					<GameCard game={game}/>
				</div>)}
			</div>
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
				<div className="content">
					{this.renderGames(user.borrowedGames())}
				</div>
			</div>
		);
	}
}

export default class User extends Page {
	static propTypes = {
		id: PropTypes.string.isRequired,
		user: PropTypes.object.isRequired
	};

	static key = "user";

	state = {};

	onDeleteUser() {
		debugger;
	}

	renderContent() {
		return (
			<this.swr model={UserModel} url={`/api/v1/user/${this.props.id}`}>
				<UserContainer
					user={this.props.user}
					onDeleteUser={this.onDeleteUser.bind(this)}
				/>
			</this.swr>
		);
	}
}
