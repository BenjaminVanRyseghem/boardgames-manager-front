import "./locations.scss";
import { Col, Container, Row } from "reactstrap";
import AddLocationCard from "components/addLocationCard/addLocationCard";
import info from "helpers/info";
import Loading from "components/loading/loading";
import Location from "models/location";
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
		error: PropTypes.object,
		user: PropTypes.object.isRequired
	};

	componentDidUpdate(prevProps) {
		if (prevProps.error !== this.props.error) {
			info.error({
				html: <Translate i18nKey="failedToLoadLocations">Failed to load locations!</Translate>
			});
		}
	}

	renderAddLocation() {
		if (!this.props.user.canAddLocations()) {
			return null;
		}

		return (
			<Col key="new-game" className="card-holder" sm={4}>
				<AddLocationCard/>
			</Col>
		);
	}

	render() {
		let { data, error } = this.props;

		if (error) {
			return null;
		}
		if (!data) {
			return <div><Loading/></div>;
		}

		if (!data.length) {
			return (
				<Container className="content">
					<Row className="locations">
						<div className="no-location">
							<Translate i18nKey="noLocationFound">No location found!</Translate>
						</div>
					</Row>
				</Container>
			);
		}

		return (
			<Container className="content">
				<Row className="locations">
					{this.renderAddLocation()}
					{data.map((location) => <Col key={location.id()} className="card-holder" sm={4}>
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
				<this.swr model={Location} url="/api/v1/location">
					<LocationsContainer user={this.props.user}/>
				</this.swr>
			</div>
		);
	}
}
