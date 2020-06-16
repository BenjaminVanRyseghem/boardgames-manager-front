import "./location.scss";
import LocationInfo from "components/locationInfo/locationInfo";
import Page from "../page";
import PropTypes from "prop-types";
import React from "react";

export default class Location extends Page {
	static defaultProps = {};

	static propTypes = {
		id: PropTypes.string.isRequired
	};

	state = {};

	renderContent() {
		let url = `/api/v1/location/${this.props.id}`;

		return (
			<div className="location">
				<this.swr url={url}>
					<LocationInfo/>
				</this.swr>
			</div>
		);
	}
}
