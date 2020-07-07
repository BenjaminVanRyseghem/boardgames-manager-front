import "./location.scss";
import { Col, Container, Row } from "reactstrap";
import DeleteLocationButton from "components/deleteLocationButton/deleteLocationButton";
import GameCard from "components/gameCard/gameCard";
import info from "helpers/info";
import Loading from "components/loading/loading";
import LocationModel from "models/location";
import Page from "../page";
import PropTypes from "prop-types";
import React from "react";
import { Redirect } from "react-router";
import Translate from "components/i18n/translate";

export class LocationInfo extends React.Component {
	static defaultProps = {
		data: undefined,
		error: undefined
	}

	static propTypes = {
		data: PropTypes.object,
		error: PropTypes.object,
		onDeleteLocation: PropTypes.func.isRequired,
		user: PropTypes.object
	};

	componentDidUpdate(prevProps) {
		if (prevProps.error !== this.props.error) {
			info.error({
				html: <Translate i18nKey="failedToLoadLocation">Failed to load location!</Translate>
			});
		}
	}

	renderGames(games) {
		if (!games.length) {
			return (
				<Row className="games no-game">
					<Col sm={{
						size: 6,
						offset: 3
					}}>
						<Translate i18nKey="noGameInLocation">
							No game in this location...
						</Translate>
					</Col>
				</Row>
			);
		}

		return (
			<Row className="games">
				{games.map((game) => <Col key={game.id} className="card-holder" sm={4}>
					<GameCard game={game}/>
				</Col>)}
			</Row>
		);
	}

	renderDeleteButton(data) {
		let canDelete = this.props.user.canDeleteGame(data) && data.hasGames();

		if (!canDelete) {
			return null;
		}

		return <DeleteLocationButton
			location={data}
			onDelete={() => this.props.onDeleteLocation(data)}
		/>;
	}

	render() {
		let { data: location, error } = this.props;
		if (error) {
			return null;
		}

		if (!location) {
			return <div className="loading"><Loading/></div>;
		}

		return (
			<div className="location-info">
				<div className="page-title"><h1>{location.name()} {this.renderDeleteButton(location)}</h1></div>
				<Container className="content">
					{this.renderGames(location.games())}
				</Container>
			</div>
		);
	}
}

export default class Location extends Page {
	static defaultProps = {};

	static propTypes = {
		id: PropTypes.string.isRequired,
		user: PropTypes.object
	};

	state = {
		redirect: false
	};

	deleteLocation(location) {
		this.fetch(`/api/v1/location/${location.id()}`, {
			method: "DELETE"
		})
			.then(() => {
				this.setState({ redirect: true });
				info.success({
					title: <Translate i18nKey="info.success">Success</Translate>,
					html: <Translate i18nKey="locationRemovedSuccessfully">
						{"Location successfully removed"}
					</Translate>
				});
			});
	}

	renderContent() {
		let url = `/api/v1/location/${this.props.id}`;

		if (this.state.redirect) {
			return <Redirect to="/locations"/>;
		}

		return (
			<div className="location">
				<this.swr model={LocationModel} url={url}>
					<LocationInfo
						user={this.props.user}
						onDeleteLocation={this.deleteLocation.bind(this)}
					/>
				</this.swr>
			</div>
		);
	}

	static sortAlphabetically(one, another) {
		return one.name() < another.name() ? -1 : 1;
	}
}
