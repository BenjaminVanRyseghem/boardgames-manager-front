import "./addGameCard.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import React from "react";
import Translate from "../i18n/translate";

export default class AddGameCard extends React.Component {
	static defaultProps = {};

	static propTypes = {};

	state = {};

	render() {
		return (
			<Link
				className="addGameCard"
				to="/add-game"
			>
				<div className="icon">
					<FontAwesomeIcon className="icon-content" icon="plus"/>
				</div>
				<div className="name">
					<h3 className="name-content">
						<Translate i18nKey="addAGame">
							Add a game
						</Translate>
					</h3>
				</div>
			</Link>
		);
	}
}
