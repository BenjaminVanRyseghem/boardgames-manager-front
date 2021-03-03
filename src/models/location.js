import Game from "./game";

const id = Symbol("id");
const name = Symbol("name");
const numberOfGames = Symbol("numberOfGames");
const games = Symbol("games");

export default class Location {
	constructor({ id: idData, name: nameData, numberOfGames: numberOfGamesData, games: gamesData }) {
		this[id] = idData;
		this[name] = nameData;
		this[numberOfGames] = numberOfGamesData;
		this[games] = gamesData ? gamesData.map((datum) => new Game(datum)) : gamesData;
	}

	id() {
		return this[id];
	}

	name() {
		return this[name];
	}

	numberOfGames() {
		return this[numberOfGames];
	}

	games() {
		return this[games];
	}

	hasGames() {
		return this.games() && this.games().length;
	}

	static sortAlphabetically(one, another) {
		return one.name() < another.name() ? -1 : 1;
	}
}
