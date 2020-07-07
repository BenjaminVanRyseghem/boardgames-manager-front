import Game from "./game";

const email = Symbol("email");
const firstName = Symbol("firstName");
const lastName = Symbol("lastName");
const role = Symbol("role");
const numberOfBorrowedGames = Symbol("numberOfBorrowedGames");
const borrowedGames = Symbol("borrowedGames");

export default class User {
	constructor({
		id,
		firstName: userFirstName = "",
		lastName: userLastName = "",
		role: userRole,
		numberOfBorrowedGames: numberOfBorrowedGamesData,
		borrowedGames: borrowedGamesData
	}) {
		this[email] = id;
		this[firstName] = userFirstName;
		this[lastName] = userLastName;
		this[role] = userRole;
		this[numberOfBorrowedGames] = numberOfBorrowedGamesData;
		this[borrowedGames] = borrowedGamesData ? borrowedGamesData.map((datum) => new Game(datum)) : null;
	}

	id() {
		return this[email];
	}

	role() {
		return this[role];
	}

	fullName() {
		return `${this[firstName]} ${this[lastName]}`;
	}

	numberOfBorrowedGames() {
		return this[numberOfBorrowedGames];
	}

	borrowedGames() {
		return this[borrowedGames];
	}

	toJSON() {
		return {
			id: this[email],
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
