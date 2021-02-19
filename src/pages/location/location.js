import "./location.scss";
import DeleteLocationButton from "components/deleteLocationButton/deleteLocationButton";
import EditLocationButton from "components/editLocationButton/editLocationButton";
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
		dataMutate: PropTypes.func,
		error: PropTypes.object,
		onDeleteLocation: PropTypes.func.isRequired,
		onUpdateLocation: PropTypes.func.isRequired,
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
				<div className="games no-game">
					<Translate i18nKey="noGameInLocation">
						No game in this location...
					</Translate>
				</div>
			);
		}

		return (
			<div className="games">
				{games.map((game) => <div key={game.id()} className="card-holder">
					<GameCard game={game}/>
				</div>)}
			</div>
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

	renderEditButton(data) {
		let canDelete = this.props.user.canEditGame(data) && data.hasGames();

		if (!canDelete) {
			return null;
		}

		return <EditLocationButton
			location={data}
			onDelete={() => this.props.onDeleteLocation(data)}
			onUpdate={(newData) => this.props.onUpdateLocation(newData, data, this.props.dataMutate)}
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
				<div className="page-title">
					<h1>
						{location.name()}
						<div className="actions">
							{this.renderEditButton(location)}
							{this.renderDeleteButton(location)}
						</div>
					</h1>
				</div>
				<div className="content">
					{this.renderGames(location.games())}
				</div>
			</div>
		);
	}
}

export default class Location extends Page {
	static key = "location";

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

	onUpdateLocation(body, location, dataMutate) {
		this.fetch(`/api/v1/location/${location.id()}`, {
			method: "PUT",
			body
		})
			.then((newLocation) => {
				dataMutate(newLocation, false);
				info.success({
					title: <Translate i18nKey="info.success">Success</Translate>,
					html: <Translate i18nKey="locationUpdatedSuccessfully">
						{"Location successfully updated"}
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
						onUpdateLocation={this.onUpdateLocation.bind(this)}
					/>
				</this.swr>
			</div>
		);
	}
}
