import Category from "./category";
import Location from "./location";
import Mechanic from "./mechanic";
import Publisher from "./publisher";
import User from "./user";

const borrowed = Symbol("borrowed");
const categories = Symbol("categories");
const complexity = Symbol("complexity");
const description = Symbol("description");
const expand = Symbol("expand");
const expansions = Symbol("expansions");
const id = Symbol("id");
const favorite = Symbol("favorite");
const link = Symbol("link");
const location = Symbol("location");
const maxPlayers = Symbol("maxPlayers");
const maxPlaytime = Symbol("maxPlaytime");
const mechanics = Symbol("mechanics");
const minAge = Symbol("minAge");
const minPlayers = Symbol("minPlayers");
const minPlaytime = Symbol("minPlaytime");
const name = Symbol("name");
const picture = Symbol("picture");
const publishers = Symbol("publishers");
const type = Symbol("type");
const yearPublished = Symbol("yearPublished");

/**
 * TODO: Write jsdoc
 * @class
 */
export default class Game {
	constructor({ // eslint-disable-line max-statements
		borrowed: borrowedData,
		categories: categoriesData,
		complexity: complexityData,
		description: descriptionData,
		expand: expandData,
		expansions: expansionsData = [],
		favorite: favoriteData,
		id: idData,
		link: linkData,
		location: locationData,
		maxPlayers: maxPlayersData,
		maxPlaytime: maxPlaytimeData,
		mechanics: mechanicsData,
		minAge: minAgeData,
		minPlayers: minPlayersData,
		minPlaytime: minPlaytimeData,
		name: nameData,
		picture: pictureData,
		publishers: publishersData,
		type: typeData,
		yearPublished: yearPublishedData
	}) {
		this[borrowed] = borrowedData ? new User(borrowedData) : null;
		this[categories] = categoriesData ? categoriesData.map((datum) => new Category(datum)) : null;
		this[complexity] = complexityData ? +complexityData / 20 : null;
		this[description] = descriptionData;
		this[expand] = expandData ? new Game(expandData) : null;
		this[expansions] = expansionsData.map((each) => new Game(each));
		this[id] = idData;
		this[favorite] = favoriteData;
		this[link] = linkData;
		this[location] = locationData ? new Location(locationData) : null;
		this[maxPlayers] = +maxPlayersData;
		this[maxPlaytime] = +maxPlaytimeData;
		this[mechanics] = mechanicsData ? mechanicsData.map((datum) => new Mechanic(datum)) : null;
		this[minAge] = +minAgeData;
		this[minPlayers] = +minPlayersData;
		this[minPlaytime] = +minPlaytimeData;
		this[name] = nameData;
		this[picture] = pictureData;
		this[publishers] = publishersData ? publishersData.map((datum) => new Publisher(datum)) : null;
		this[type] = typeData;
		this[yearPublished] = yearPublishedData;
	}

	id() {
		return this[id];
	}

	name() {
		return this[name];
	}

	picture() {
		return this[picture] || `${process.env.PUBLIC_URL}/missing.png`; // eslint-disable-line no-process-env
	}

	borrowed() {
		return this[borrowed];
	}

	isBorrowed() {
		return !!this[borrowed];
	}

	favorite() {
		return !!this[favorite];
	}

	type() {
		return this[type];
	}

	complexity() {
		return this[complexity];
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

	hasTime() {
		return !!this[minPlaytime] && !!this[maxPlaytime];
	}

	link() {
		return this[link];
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
