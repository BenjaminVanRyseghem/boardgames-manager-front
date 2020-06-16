import "./game.scss";
import BorrowersContainer from "components/borrowersContainer/borrowersContainer";
import DeleteGameButton from "components/deleteGameButton/deleteGameButton";
import GameInfo from "components/gameInfo/gameInfo";
import globalState from "models/globalState";
import info from "helpers/info";
import LendToButton from "components/lendToButton/lendToButton";
import Loading from "components/loading/loading";
import LocationsContainer from "components/locationsContainer/locationsContainer";
import MoveToButton from "components/moveToButton/moveToButton";
import { mutate } from "swr";
import Page from "../page";
import PropTypes from "prop-types";
import React from "react";
import { Redirect } from "react-router";
import Translate from "components/i18n/translate";

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
		deleteGame: PropTypes.func.isRequired,
		error: PropTypes.bool,
		lendTo: PropTypes.func.isRequired,
		moveTo: PropTypes.func.isRequired,
		mutateSWR: PropTypes.func.isRequired,
		redirect: PropTypes.func.isRequired,
		url: PropTypes.string.isRequired
	};

	state = {};

	deleteGame() {
		this.props.deleteGame(this.props.data);
	}

	moveTo(location) {
		this.props.moveTo(location, this.props.data)
			.then((datum) => this.props.mutateSWR(this.props.url, datum, false));
	}

	lendTo(borrowed) {
		this.props.lendTo(borrowed, this.props.data)
			.then((datum) => this.props.mutateSWR(this.props.url, datum, false));
	}

	renderUsers() {
		return React.cloneElement(this.props.Users, {
			lendTo: this.lendTo.bind(this)
		});
	}

	renderLocations() {
		return React.cloneElement(this.props.Locations, {
			gameLocation: this.props.data.location.id,
			moveTo: this.moveTo.bind(this)
		});
	}

	render() {
		let { data, error } = this.props;

		if (error) {
			info.error({
				html: <Translate i18nKey="failedToLoadGame">Failed to load game!</Translate>
			});
			return null;
		}
		if (data === null) {
			return <div><Translate i18nKey="noGameFound">No game found!</Translate></div>;
		}

		if (!data) {
			return <div><Loading/></div>;
		}

		return (
			<div className="game-container">
				<GameInfo game={data}/>
				<div className="actions">
					{this.props.canLendGame(data) && <div className="action lend">
						<LendToButton
							fetch={fetch}
							lendTo={this.lendTo.bind(this)}
							lent={!!data.borrowed}
							Users={this.renderUsers()}
						/>
					</div>}
					{this.props.canMoveGame(data) && <div className="action move">
						<MoveToButton
							fetch={fetch}
							Locations={this.renderLocations()}
						/>
					</div>}
					{this.props.canDeleteGame(data) && <div className="action delete">
						<DeleteGameButton
							game={data}
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
		id: PropTypes.string.isRequired
	};

	state = {
		redirect: false
	};

	lendTo(borrowed, game) {
		if (!globalState.user().canLendGame(game)) {
			info.Error({
				title: <Translate i18nKey="error">Error</Translate>,
				html: <Translate i18nKey="unauthorizedAction">
					{"Unauthorized action"}
				</Translate>
			});
			return Promise.reject(new Error());
		}

		return this.fetch(`/api/v1/game/${game.id}`, {
			method: "PUT",
			body: {
				borrowed
			}
		})
			.then((datum) => {
				if (borrowed) {
					info.success({
						title: <Translate i18nKey="success">Success</Translate>,
						html: <Translate i18nKey="gameLentSuccessfully">
							{"Game successfully lent"}
						</Translate>
					});
				} else {
					info.success({
						title: <Translate i18nKey="success">Success</Translate>,
						html: <Translate i18nKey="gameRetrievedSuccessfully">
							{"Game successfully retrieved"}
						</Translate>
					});
				}
				return datum;
			});
	}

	deleteGame(game) {
		if (!globalState.user().canDeleteGame(game)) {
			info.Error({
				title: <Translate i18nKey="error">Error</Translate>,
				html: <Translate i18nKey="unauthorizedAction">
					{"Unauthorized action"}
				</Translate>
			});
			return;
		}

		this.fetch(`/api/v1/game/${game.id}`, {
			method: "DELETE"
		})
			.then(() => {
				this.props.redirect();
				info.success({
					title: <Translate i18nKey="success">Success</Translate>,
					html: <Translate i18nKey="gameRemovedSuccessfully">
						{"Game successfully removed"}
					</Translate>
				});
			});
	}

	moveTo(location, game) {
		if (!globalState.user().canMoveGame(game)) {
			info.Error({
				title: <Translate i18nKey="error">Error</Translate>,
				html: <Translate i18nKey="unauthorizedAction">
					{"Unauthorized action"}
				</Translate>
			});
			return Promise.reject(new Error());
		}

		return this.fetch(`/api/v1/game/${game.id}`, {
			method: "PUT",
			body: {
				location
			}
		})
			.then((datum) => {
				info.success({
					title: <Translate i18nKey="success">Success</Translate>,
					html: <Translate i18nKey="gameMovedSuccessfully">
						{"Game successfully moved"}
					</Translate>
				});

				return datum;
			});
	}

	renderContent() {
		if (this.state.redirect) {
			return (
				<Redirect to="/games"/>
			);
		}

		let canDeleteGame = (game) => globalState.user().canDeleteGame(game);
		let canLendGame = (game) => globalState.user().canLendGame(game);
		let canMoveGame = (game) => globalState.user().canMoveGame(game);

		return (
			<div className="game">
				<this.swr url={`/api/v1/game/${this.props.id}`}>
					<GameContainer
						canDeleteGame={canDeleteGame}
						canLendGame={canLendGame}
						canMoveGame={canMoveGame}
						deleteGame={this.deleteGame.bind(this)}
						lendTo={this.lendTo.bind(this)}
						Locations={<this.swr url="/api/v1/location"><LocationsContainer/></this.swr>}
						moveTo={this.moveTo.bind(this)}
						mutateSWR={mutate}
						redirect={() => this.setState({ redirect: true })}
						url={`/api/v1/game/${this.props.id}`}
						Users={<this.swr url="/api/v1/user"><BorrowersContainer/></this.swr>}
					/>
				</this.swr>
			</div>
		);
	}
}
