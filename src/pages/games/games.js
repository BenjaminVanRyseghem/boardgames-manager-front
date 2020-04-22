import "./games.scss";
import fetcher from "helpers/fetcher";
import Game from "components/game/game";
import Loading from "components/loading/loading";
import Menu from "components/menu/menu";
import Page from "../page";
import querystring from "querystring";
import React from "react";
import useSWR from "swr";

function GamesContainer({ filters = {} }) { // eslint-disable-line react/prop-types
	const { data, error } = useSWR(`api/v1/game?${querystring.stringify(filters)}`, fetcher);

	if (error) {
		return <div>failed to load</div>;
	}
	if (!data) {
		return <div><Loading/></div>;
	}

	if (!data.length) {
		return <div>No game found</div>;
	}

	return (
		<ul className="games">
			{data.rows.map((game) => {
				let id = game._id; // eslint-disable-line no-underscore-dangle
				return <li key={id} className="game"><Game game={game}/></li>;
			})}
		</ul>
	);
}

export default class Games extends Page {
	static key = "games";

	state = {
		filters: {}
	};

	setGameFilters(filters) {
		this.setState({ filters });
	}

	renderContent() {
		return (
			<>
				<div className="menu">
					<Menu setGameFilters={this.setGameFilters.bind(this)}/>
				</div>
				<div className="content">
					<GamesContainer filters={this.state.filters}/>
				</div>
			</>
		);
	}
}
