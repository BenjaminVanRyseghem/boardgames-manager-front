import "./home.scss";
import fetcher from "helpers/fetcher";
import Game from "components/game/game";
import Loading from "components/loading/loading";
import Menu from "components/menu/menu";
import Page from "../page";
import querystring from "querystring";
import React from "react";
import useSWR from "swr";

function Games({ filters = {} }) { // eslint-disable-line react/prop-types
	const { data, error } = useSWR(`api/v1/games?${querystring.stringify(filters)}`, fetcher);

	if (error) {
		return <div>failed to load</div>;
	}
	if (!data) {
		return <div><Loading/></div>;
	}

	if (!data.length) {
		return <div>No game found</div>;
	}

	// eslint-disable-next-line no-underscore-dangle
	return (
		<ul className="games">
			{data.rows.map((game) => {
				// eslint-disable-next-line no-underscore-dangle
				let id = game._id;
				return <li key={id} className="game"><Game game={game}/></li>;
			})}
		</ul>
	);
}

export default class Home extends Page {
	state = {
		filters: {}
	};

	renderContent() {
		return <Games filters={this.state.filters}/>;
	}

	setGameFilters(filters) {
		this.setState({ filters });
	}

	render() {
		return (
			<div className="home">
				<div className="menu">
					<Menu setGameFilters={this.setGameFilters.bind(this)}/>
				</div>
				<div className="content">
					{this.renderContent()}
				</div>
			</div>
		);
	}
}
