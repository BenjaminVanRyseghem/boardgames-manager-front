import "./addLocationCard.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import React from "react";
import Translate from "../i18n/translate";

export default class AddLocationCard extends React.Component {
	static defaultProps = {};

	static propTypes = {};

	state = {};

	render() {
		return (
			<div className="addLocationCard">
				<div className="content">
					<div className="avatar"><FontAwesomeIcon className="icon" icon="plus"/></div>
					<Link className="content" to="/add-location">
						<div className="name">
							<Translate i18nKey="addALocation">
								Add a game
							</Translate>
						</div>
					</Link>
				</div>
			</div>
		);
	}
}
