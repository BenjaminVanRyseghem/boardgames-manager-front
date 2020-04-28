import "./game.scss";
import fetcher from "helpers/fetcher";
import GameComponent from "components/game/game";
import info from "helpers/info";
import Loading from "components/loading/loading";
import Page from "../page";
import PropTypes from "prop-types";
import React from "react";
import Translate from "components/i18n/translate";
import useSWR from "swr";

function GameContainer({ id }) { // eslint-disable-line react/prop-types
	const { data, error } = useSWR(`/api/v1/game/${id}`, fetcher);

	if (error) {
		info.error({
			html: <Translate i18nKey="failedToLoadGame">Failed to load game!</Translate>
		});
		return null;
	}
	if (!data) {
		return <div><Loading/></div>;
	}

	if (data === null) {
		return <div><Translate i18nKey="noGameFound">No game found!</Translate></div>;
	}

	return (
		<div className="game-container">
			<GameComponent game={data}/>
		</div>
	);
}

export default class Game extends Page {
	static defaultProps = {};

	static propTypes = {
		id: PropTypes.string.isRequired
	};

	state = {
		game: undefined
	};

	renderContent() {
		return (
			<div className="game">
				<GameContainer id={this.props.id}/>
				Actions
			</div>
		);
	}
}
