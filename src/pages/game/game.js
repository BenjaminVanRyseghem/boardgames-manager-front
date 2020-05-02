import "./game.scss";
import { Button } from "reactstrap";
import fetcher from "helpers/fetcher";
import GameInfo from "components/gameInfo/gameInfo";
import info from "helpers/info";
import LendToButton from "components/lendToButton/lendToButton";
import Loading from "components/loading/loading";
import Page from "../page";
import PropTypes from "prop-types";
import React from "react";
import Translate from "components/i18n/translate";
import useSWR from "swr";

function GameContainer({ id, actions }) { // eslint-disable-line react/prop-types
	const { data, error } = useSWR(`/api/v1/game/${id}`, fetcher);

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
			{actions}
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

	renderActions() {
		return (
			<div className="actions">
				<div className="action lend">
					<LendToButton/>
				</div>
				<div className="action move">
					<Button color="primary">
						<Translate i18nKey="moveTo">Move to...</Translate>
					</Button>
				</div>
				<div className="action delete">
					<Button color="danger">
						<Translate i18nKey="deleteGame">Delete</Translate>
					</Button>
				</div>
			</div>
		);
	}

	renderContent() {
		return (
			<div className="game">
				<GameContainer actions={this.renderActions()} id={this.props.id}/>
			</div>
		);
	}
}
