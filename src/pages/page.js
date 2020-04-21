import "./page.scss";
import fetcher from "helpers/fetcher";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import globalState from "models/globalState";
import { ReactComponent as Logo } from "./logo.svg";

import React from "react";
import yearCopyright from "../helpers/yearCopyright";

const requests = Symbol("requests");

export default class Page extends React.Component {
	static key = "";

	constructor() {
		super(...arguments); // eslint-disable-line prefer-rest-params

		this[requests] = [];
		this.state = { [this.constructor.key]: null };
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

		let currentUser = globalState.getUser();

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

	renderFooter() {
		if (this.noFooter) {
			return null;
		}

		return (
			<div className="footer">
				<div className="logo">
					Provided with <FontAwesomeIcon icon="heart"/> by <span className="font-weight-bold">Benjamin Van Ryseghem</span>
				</div>
			</div>
		);
	}

	render() {
		return (
			<>
				<div className={`page-body ${this.noFooter ? "no-footer" : ""}`}>
					<div className={`page 
							${this.className ? this.className : this.constructor.key || ""}
							${this.title ? "" : "no-title"}
						`}>
						{this.renderTitle()}
						<div className="page-content">
							{this.renderContent()}
						</div>
					</div>
				</div>
				{this.renderFooter()}
			</>
		);
	}
}
