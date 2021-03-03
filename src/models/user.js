import Game from "./game";
import { roles } from "./accessControl";

const id = Symbol("id");
const firstName = Symbol("firstName");
const lastName = Symbol("lastName");
const role = Symbol("role");
const numberOfBorrowedGames = Symbol("numberOfBorrowedGames");
const borrowedGames = Symbol("borrowedGames");

export default class User {
	constructor({
		id: userId,
		firstName: userFirstName = "",
		lastName: userLastName = "",
		role: userRole,
		numberOfBorrowedGames: numberOfBorrowedGamesData,
		borrowedGames: borrowedGamesData
	}) {
		this[id] = userId;
		this[firstName] = userFirstName;
		this[lastName] = userLastName;
		this[role] = roles[userRole] || roles.anonymous;
		this[numberOfBorrowedGames] = numberOfBorrowedGamesData;
		this[borrowedGames] = borrowedGamesData ? borrowedGamesData.map((datum) => new Game(datum)) : null;
	}

	id() {
		return this[id];
	}

	role() {
		return this[role];
	}

	fullName() {
		return `${this[firstName]} ${this[lastName]}`;
	}

	firstName() {
		return this[firstName];
	}

	lastName() {
		return this[lastName];
	}

	numberOfBorrowedGames() {
		return this[numberOfBorrowedGames];
	}

	borrowedGames() {
		return this[borrowedGames];
	}

	toJSON() {
		return {
			id: this[id],
			firstName: this[firstName],
			lastName: this[lastName],
			role: this[role]
		};
	}

	static from(user, options = {}) {
		let data = {
			...user.toJSON(),
			...options
		};

		return new this(data);
	}

	static sortAlphabetically(one, another) {
		return one.fullName() < another.fullName() ? -1 : 1;
	}
}
