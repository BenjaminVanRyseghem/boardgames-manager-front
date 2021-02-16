import Category from "./category";
import Location from "./location";
import Mechanic from "./mechanic";
import Publisher from "./publisher";
import User from "./user";

const id = Symbol("id");
const name = Symbol("name");
const picture = Symbol("picture");
const borrowed = Symbol("borrowed");
const minPlaytime = Symbol("minPlaytime");
const maxPlaytime = Symbol("maxPlaytime");
const minPlayers = Symbol("minPlayers");
const maxPlayers = Symbol("maxPlayers");
const minAge = Symbol("minAge");
const yearPublished = Symbol("yearPublished");
const description = Symbol("description");
const location = Symbol("location");
const categories = Symbol("categories");
const mechanics = Symbol("mechanics");
const publishers = Symbol("publishers");
const type = Symbol("type");
const expansions = Symbol("expansions");
const expand = Symbol("expand");

/**
 * TODO: Write jsdoc
 * @class
 */
export default class Game {
	constructor({
		id: idData,
		name: nameData,
		picture: pictureData,
		borrowed: borrowedData,
		minPlaytime: minPlaytimeData,
		maxPlaytime: maxPlaytimeData,
		minPlayers: minPlayersData,
		maxPlayers: maxPlayersData,
		minAge: minAgeData,
		location: locationData,
		yearPublished: yearPublishedData,
		description: descriptionData,
		categories: categoriesData,
		mechanics: mechanicsData,
		publishers: publishersData,
		type: typeData,
		expansions: expansionsData = [],
		expand: expandData,
	}) {
		this[id] = idData;
		this[name] = nameData;
		this[picture] = pictureData;
		this[minPlaytime] = minPlaytimeData;
		this[maxPlaytime] = maxPlaytimeData;
		this[minPlayers] = minPlayersData;
		this[maxPlayers] = maxPlayersData;
		this[minAge] = minAgeData;
		this[yearPublished] = yearPublishedData;
		this[description] = descriptionData;
		this[borrowed] = borrowedData ? new User(borrowedData) : null;
		this[location] = locationData ? new Location(locationData) : null;
		this[categories] = categoriesData ? categoriesData.map((datum) => new Category(datum)) : null;
		this[mechanics] = mechanicsData ? mechanicsData.map((datum) => new Mechanic(datum)) : null;
		this[publishers] = publishersData ? publishersData.map((datum) => new Publisher(datum)) : null;
		this[type] = typeData;
		this[expansions] = expansionsData.map((each) => new Game(each));
		this[expand] = expandData ? new Game(expandData) : null;
	}

	id() {
		return this[id];
	}

	name() {
		return this[name];
	}

	picture() {
		return this[picture];
	}

	borrowed() {
		return this[borrowed];
	}

	isBorrowed() {
		return !!this[borrowed];
	}

	type() {
		return this[type];
	}

	expansions() {
		return this[expansions];
	}

	expand() {
		return this[expand];
	}

	playtimeRange() {
		let time = `${this[minPlaytime]}'-${this[maxPlaytime]}'`;

		if (this[minPlaytime] === this[maxPlaytime]) {
			time = `${this[minPlaytime]}'`;
		}

		return time;
	}

	playersRange() {
		return `${this[minPlayers]}-${this[maxPlayers]}`;
	}

	minAge() {
		return this[minAge];
	}

	location() {
		return this[location];
	}

	yearPublished() {
		return this[yearPublished];
	}

	description() {
		return this[description];
	}

	categories() {
		return this[categories];
	}

	mechanics() {
		return this[mechanics];
	}

	publishers() {
		return this[publishers];
	}
}
