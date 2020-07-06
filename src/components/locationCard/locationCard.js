import "./locationCard.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";
import Translate from "../i18n/translate";

export default class LocationCard extends React.Component {
	static propTypes = {
		location: PropTypes.object.isRequired
	};

	state = {};

	render() {
		let { location } = this.props;
		return (
			<div className="locationCard">
				<div className="content">
					<div className="avatar"><FontAwesomeIcon className="icon" icon="map-marker-alt"/></div>
					<Link className="content" to={`/location/${location.id()}`}>
						<div className="name">{location.name()}</div>
						<div className="number-of-games">
							<Translate count={location.numberOfGames()} i18nKey="numberOfGames">
								(%count% games)
							</Translate>
						</div>
					</Link>
				</div>
			</div>
		);
	}
}
