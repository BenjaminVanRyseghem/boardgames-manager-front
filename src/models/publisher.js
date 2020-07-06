const id = Symbol("id");
const name = Symbol("name");

export default class Publisher {
	constructor({ id: idData, name: nameData }) {
		this[id] = idData;
		this[name] = nameData;
	}

	id() {
		return this[id];
	}

	name() {
		return this[name];
	}
}
