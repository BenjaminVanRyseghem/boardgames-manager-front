import "./locationInfo.scss";
import { Col, Container, Row } from "reactstrap";
import GameCard from "components/gameCard/gameCard";
import info from "helpers/info";
import Loading from "components/loading/loading";
import PropTypes from "prop-types";
import React from "react";
import Translate from "components/i18n/translate";

export default class LocationInfo extends React.Component {
	static defaultProps = {
		data: undefined,
		error: undefined
	}

	static propTypes = {
		data: PropTypes.object,
		error: PropTypes.bool
	};

	render() {
		let { data, error } = this.props;
		if (error) {
			info.error({
				html: <Translate i18nKey="failedToLoadLocation">Failed to load location!</Translate>
			});
			return null;
		}

		if (!data) {
			return <div className="loading"><Loading/></div>;
		}

		return (
			<div className="location-info">
				<div className="page-title"><h1>{data.name}</h1></div>
				<Container className="content">
					<Row className="games">
						{data.games.map((game) => <Col key={game.id} className="card-holder" sm={4}>
							<GameCard game={game}/>
						</Col>)}
					</Row>
				</Container>
			</div>
		);
	}
}

