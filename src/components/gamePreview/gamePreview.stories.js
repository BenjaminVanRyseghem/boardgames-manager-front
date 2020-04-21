import GamePreview from "./gamePreview";
import React from "react";

export default {
	component: GamePreview,
	title: "Components/GamePreview"
};

const boardgame = {
	type: "boardgame",
	name: "Above and Below: Desert Labyrinth and Underforest Encounter Book",
	id: "229085",
	source: "boardgamegeek",
	page: "https://www.boardgamegeek.com/boardgame/229085",
	yearpublished: "2015"
};

const boardgameaccessory = {
	...boardgame,
	type: "boardgameaccessory"
};

const boardgameexpansion = {
	...boardgame,
	type: "boardgameexpansion"
};

const videogame = {
	...boardgame,
	type: "videogame"
};

const rpgitem = {
	...boardgame,
	type: "rpgitem"
};

const query = "dese";

export const boardGame = () => <GamePreview data={boardgame} query={query}/>;
export const boardGameAccessory = () => <GamePreview data={boardgameaccessory} query={query}/>;
export const boardGameExpansion = () => <GamePreview data={boardgameexpansion} query={query}/>;
export const videoGame = () => <GamePreview data={videogame} query={query}/>;
export const rpgItem = () => <GamePreview data={rpgitem} query={query}/>;
