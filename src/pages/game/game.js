/* eslint max-lines: [2, 350] */
import "./game.scss";
import BorrowersContainer from "components/borrowersContainer/borrowersContainer";
import { Button } from "reactstrap";
import DeleteGameButton from "components/deleteGameButton/deleteGameButton";
import GameInfo from "components/gameInfo/gameInfo";
import GameModel from "models/game";
import info from "helpers/info";
import LendToButton from "components/lendToButton/lendToButton";
import Loading from "components/loading/loading";
import Location from "models/location";
import LocationsContainer from "components/locationsContainer/locationsContainer";
import MoveToButton from "components/moveToButton/moveToButton";
import Page from "../page";
import PropTypes from "prop-types";
import React from "react";
import { Redirect } from "react-router";
import Translate from "components/i18n/translate";
import User from "models/user";

export class GameContainer extends React.Component {
	static defaultProps = {
		data: undefined,
		error: undefined
	}

	static propTypes = {
		Locations: PropTypes.node.isRequired,
		Users: PropTypes.node.isRequired,
		canDeleteGame: PropTypes.func.isRequired,
		canLendGame: PropTypes.func.isRequired,
		canMoveGame: PropTypes.func.isRequired,
		data: PropTypes.object,
		dataMutate: PropTypes.func,
		deleteGame: PropTypes.func.isRequired,
		error: PropTypes.object,
		lendTo: PropTypes.func.isRequired,
		like: PropTypes.func.isRequired,
		moveTo: PropTypes.func.isRequired,
		user: PropTypes.object.isRequired
	};

	state = {};

	deleteGame() {
		this.props.deleteGame(this.props.data);
	}

	moveTo(location) {
		this.props.moveTo(location, this.props.data)
			.then((datum) => this.props.dataMutate(datum));
	}

	lendTo(borrowed) {
		this.props.lendTo(borrowed, this.props.data)
			.then((datum) => this.props.dataMutate(datum));
	}

	like(bool) {
		this.props.like(bool, this.props.dataMutate);
	}

	renderUsers() {
		return React.cloneElement(this.props.Users, {
			borrower: this.props.data.borrowed()?.id,
			lendTo: this.lendTo.bind(this)
		});
	}

	renderLocations() {
		return React.cloneElement(this.props.Locations, {
			gameLocation: this.props.data.location().id(),
			moveTo: this.moveTo.bind(this)
		});
	}

	componentDidUpdate(prevProps) {
		if (prevProps.error !== this.props.error) {
			info.error({
				html: <Translate i18nKey="failedToLoadGame">Failed to load game!</Translate>,
				onAfterClose: () => {
					if (this.props.error?.error?.code === 404) {
						this.setState({ redirectToGames: true });
					}
				}
			});
		}
	}

	renderLikeButton() {
		if (this.props.data?.favorite()) {
			return (
				<Button color="primary" onClick={this.like.bind(this, false)}>
					<Translate i18nKey="unlike">Unlike</Translate>
				</Button>
			);
		}
		return (
			<Button color="primary" onClick={this.like.bind(this, true)}>
				<Translate i18nKey="like">Like</Translate>
			</Button>
		);
	}

	render() {
		let { data: game, error } = this.props;

		if (this.state.redirectToGames) {
			return <Redirect to="/"/>;
		}

		if (error) {
			return null;
		}
		if (game === null) {
			return <div><Translate i18nKey="noGameFound">No game found!</Translate></div>;
		}

		if (!game) {
			return <div><Loading/></div>;
		}

		return (
			<div className="game-container">
				<GameInfo game={game} user={this.props.user}/>
				<div className="actions">
					<div className="action like">
						{this.renderLikeButton()}
					</div>
				</div>
				<div className="admin-actions">
					{this.props.canLendGame(game) && <div className="action lend">
						<LendToButton
							fetch={fetch}
							lendTo={this.lendTo.bind(this)}
							lent={game.isBorrowed()}
							Users={this.renderUsers()}
						/>
					</div>}
					{this.props.canMoveGame(game) && <div className="action move">
						<MoveToButton
							fetch={fetch}
							Locations={this.renderLocations()}
						/>
					</div>}
					{this.props.canDeleteGame(game) && <div className="action delete">
						<DeleteGameButton
							game={game}
							onDelete={this.deleteGame.bind(this)}
						/>
					</div>}
				</div>
			</div>
		);
	}
}

export default class Game extends Page {
	static defaultProps = {};

	static propTypes = {
		id: PropTypes.string.isRequired,
		user: PropTypes.object.isRequired
	};

	state = {
		redirect: false
	};

	lendTo(borrowed, game) {
		if (!this.props.user.canLendGame(game)) {
			info.Error({
				title: <Translate i18nKey="info.error">Error</Translate>,
				html: <Translate i18nKey="unauthorizedAction">
					{"Unauthorized action"}
				</Translate>
			});
			return Promise.reject(new Error());
		}

		return this.fetch(`/api/v1/game/${game.id()}`, {
			method: "PUT",
			body: {
				borrowed
			}
		})
			.then((datum) => {
				if (borrowed) {
					info.success({
						title: <Translate i18nKey="info.success">Success</Translate>,
						html: <Translate i18nKey="game.lentSuccessfully">
							{"Game successfully lent"}
						</Translate>
					});
				} else {
					info.success({
						title: <Translate i18nKey="info.success">Success</Translate>,
						html: <Translate i18nKey="game.retrievedSuccessfully">
							{"Game successfully retrieved"}
						</Translate>
					});
				}
				return datum;
			});
	}

	deleteGame(game) {
		if (!this.props.user.canDeleteGame(game)) {
			info.Error({
				title: <Translate i18nKey="info.error">Error</Translate>,
				html: <Translate i18nKey="unauthorizedAction">
					{"Unauthorized action"}
				</Translate>
			});
			return;
		}

		this.fetch(`/api/v1/game/${game.id()}`, {
			method: "DELETE"
		})
			.then(() => {
				this.setState({ redirect: true });
				info.success({
					title: <Translate i18nKey="info.success">Success</Translate>,
					html: <Translate i18nKey="game.removedSuccessfully">
						{"Game successfully removed"}
					</Translate>
				});
			});
	}

	moveTo(location, game) {
		if (!this.props.user.canMoveGame(game)) {
			info.Error({
				title: <Translate i18nKey="info.error">Error</Translate>,
				html: <Translate i18nKey="unauthorizedAction">
					{"Unauthorized action"}
				</Translate>
			});
			return Promise.reject(new Error());
		}

		return this.fetch(`/api/v1/game/${game.id()}`, {
			method: "PUT",
			body: {
				location
			}
		})
			.then((datum) => {
				info.success({
					title: <Translate i18nKey="info.success">Success</Translate>,
					html: <Translate i18nKey="game.movedSuccessfully">
						{"Game successfully moved"}
					</Translate>
				});

				return datum;
			});
	}

	like(bool, mutate) {
		return this.fetch(`/api/v1/game/${this.props.id}/like`, {
			method: "POST",
			body: {
				like: bool
			}
		})
			.then((datum) => {
				mutate(datum);
			});
	}

	renderContent() {
		if (this.state.redirect) {
			return (
				<Redirect to="/games"/>
			);
		}

		let canDeleteGame = (game) => this.props.user.canDeleteGame(game);
		let canLendGame = (game) => this.props.user.canLendGame(game);
		let canMoveGame = (game) => this.props.user.canMoveGame(game);

		return (
			<div key={this.props.id} className="game">
				<this.swr model={GameModel} url={`/api/v1/game/${this.props.id}`}>
					<GameContainer
						canDeleteGame={canDeleteGame}
						canLendGame={canLendGame}
						canMoveGame={canMoveGame}
						deleteGame={this.deleteGame.bind(this)}
						lendTo={this.lendTo.bind(this)}
						like={this.like.bind(this)}
						Locations={<this.swr model={Location} url="/api/v1/location"><LocationsContainer/></this.swr>}
						moveTo={this.moveTo.bind(this)}
						user={this.props.user}
						Users={<this.swr model={User} url="/api/v1/user"><BorrowersContainer/></this.swr>}
					/>
				</this.swr>
			</div>
		);
	}
}
