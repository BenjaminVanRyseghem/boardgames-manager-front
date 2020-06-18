import "./location.scss";
import { Col, Container, Row } from "reactstrap";
import GameCard from "components/gameCard/gameCard";
import info from "helpers/info";
import Loading from "components/loading/loading";
import Page from "../page";
import PropTypes from "prop-types";
import React from "react";
import Translate from "components/i18n/translate";

export class LocationInfo extends React.Component {
	static defaultProps = {
		data: undefined,
		error: undefined
	}

	static propTypes = {
		data: PropTypes.object,
		error: PropTypes.object
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

	render() {
		let { data, error } = this.props;
		if (error) {
			return null;
		}

		if (!data) {
			return <div className="loading"><Loading/></div>;
		}

		return (
			<div className="location-info">
				<div className="page-title"><h1>{data.name}</h1></div>
				<Container className="content">
					{this.renderGames(data.games)}
				</Container>
			</div>
		);
	}
}

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
