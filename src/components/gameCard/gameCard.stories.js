import GameCard from "./gameCard";
import React from "react";

const game = {
	name: "Zombicide",
	description: "Zombicide is a collaborative game in which players take the role of a survivor &amp;ndash; each with unique abilities &amp;ndash; and harness both their skills and the power of teamwork against the hordes of unthinking undead! Zombies are predictable, stupid but deadly, controlled by simple rules and a deck of cards. Unfortunately for you, there are a LOT more zombies than you have bullets.&amp;#10;&amp;#10;Find weapons, kill zombies. The more zombies you kill, the more skilled you get; the more skilled you get, the more zombies appear. The only way out is zombicide!&amp;#10;&amp;#10;Play ten scenarios on different maps made from the included modular map tiles, download new scenarios from the designer's website, or create your own!&amp;#10;&amp;#10;&amp;#10;     This is just a great game for zombie lovers!&amp;#10;&amp;#10;&amp;#10;Integrates with:&amp;#10;&amp;#10;    Zombicide Season 2: Prison Outbreak&amp;#10;    Zombicide Season 3: Rue Morgue&amp;#10;&amp;#10;&amp;#10;&amp;#10;&amp;#10;",
	minPlayers: 1,
	maxPlayers: 5,
	minPlaytime: 90,
	maxPlaytime: 180,
	minAge: 13,
	picture: "https://cf.geekdo-images.com/original/img/FwnbGGrU7av4j8kB11VZZRB58U4=/0x0/pic1196191.jpg",
	borrowed: null,
	location: {
		id: 7,
		name: 7
	},
	publishers: [
		{
			id: 1,
			foreignId: 2014,
			value: "CMON Limited"
		}
	],
	yearPublished: "2012",
	categories: [
		{
			id: "1",
			value: "Horror"
		},
		{
			id: "2",
			value: "Miniatures"
		},
		{
			id: "3",
			value: "Zombies"
		}
	],
	mechanics: [
		{ value: "Action Point Allowance System" },
		{ value: "Cooperative Play" },
		{ value: "Dice Rolling" },
		{ value: "Hand Management" },
		{ value: "Modular Board" },
		{ value: "Player Elimination" },
		{ value: "Variable Player Powers" }
	]
};

const borrowedGame = {
	...game,
	borrowed: {
		id: 12,
		firstName: "Julien",
		lastName: "Sebastien"
	}
};

export default {
	component: GameCard,
	title: "Components/GameCard"
};

export const shows = () => <GameCard game={game}/>;
export const showsBorrowedGame = () => <GameCard game={borrowedGame}/>;
