import "./locations.scss";
import { Col, Container, Row } from "reactstrap";
import info from "helpers/info";
import Loading from "components/loading/loading";
import LocationCard from "components/locationCard/locationCard";
import Page from "../page";
import PropTypes from "prop-types";
import React from "react";
import Translate from "components/i18n/translate";

export class LocationsContainer extends React.Component {
	static defaultProps = {
		data: undefined,
		error: undefined
	}

	static propTypes = {
		data: PropTypes.array,
		error: PropTypes.bool
	};

	render() {
		let { data, error } = this.props;

		if (error) {
			info.error({
				html: <Translate i18nKey="failedToLoadGames">Failed to load games!</Translate>
			});
			return null;
		}
		if (!data) {
			return <div><Loading/></div>;
		}

		if (!data.length) {
			return (
				<Container className="content">
					<Row className="locations">
						<div className="no-location"><Translate i18nKey="noLocationFound">No location found!</Translate>
						</div>
					</Row>
				</Container>
			);
		}

		return (
			<Container className="content">
				<Row className="locations">
					{data.map((location) => <Col key={location.id} className="card-holder" sm={4}>
						<LocationCard location={location}/>
					</Col>)}
				</Row>
			</Container>
		);
	}
}

export default class Locations extends Page {
	static defaultProps = {};

	static propTypes = {};

	state = {};

	title = <Translate i18nKey="locations">Locations</Translate>;

	renderContent() {
		return (
			<div className="locationsContainer">
				<this.swr url="/api/v1/location">
					<LocationsContainer/>
				</this.swr>
			</div>
		);
	}
}
