import "./page.scss";
import useSWR, { mutate } from "swr";
import fetcher from "helpers/fetcher";
import globalState from "models/globalState";
import NavigationMenu from "components/navigationMenu/navigationMenu";
import React from "react";

const requests = Symbol("requests");

export default class Page extends React.Component {
	static key = "";

	constructor() {
		super(...arguments); // eslint-disable-line prefer-rest-params

		this[requests] = [];
		this.state = { [this.constructor.key]: null };
		this.swr = this.swr.bind(this);
	}

	swr({ children, url, ...others }) {
		let { data, error } = useSWR(url, this.fetch.bind(this));

		return React.cloneElement(children, {
			mutateSWR: mutate,
			...others,
			data,
			error
		});
	}

	isLoading() {
		return this.state[this.constructor.key] === null || window.location.toString().indexOf("loading=true") !== -1;
	}

	isEmpty() {
		if (this.isLoading()) {
			return false;
		}

		let value = this.state[this.constructor.key];
		let isArray = value.constructor === Array;

		return !value || (isArray && !value.length);
	}

	fetch(input, init = {}) {
		init.credentials = init.credentials || "same-origin";
		init.headers = init.headers || {};
		init.headers.Accept = init.headers.Accept || "application/json";
		init.headers["Content-Type"] = init.headers["Content-Type"] || "application/json";
		init.body = init.body === undefined ? undefined : JSON.stringify(init.body);

		let currentUser = globalState.user();

		if (currentUser) {
			init.headers.Authorization = `Bearer ${currentUser.token()}`;
		}

		let promise = fetcher(input, init);
		this[requests].push(promise);

		return promise;
	}

	componentWillUnmount() {
		this[requests].forEach((promise) => promise.cancel());
		this[requests] = [];
	}

	renderTitle() {
		if (!this.title) {
			return null;
		}

		return (
			<div className="page-title"><h1>{typeof this.title === "function" ? this.title() : this.title}</h1></div>
		);
	}

	renderContent() {
		throw new Error("[Page/renderContent] Must be overridden");
	}

	render() {
		return (
			<div className={`page 
				${this.className ? this.className : this.constructor.key || ""}
				${this.title ? "" : "no-title"}
			`}>
				<div className="navigation">
					<NavigationMenu/>
				</div>
				{this.renderTitle()}
				<div className="page-content">
					{this.renderContent()}
				</div>
			</div>
		);
	}
}
