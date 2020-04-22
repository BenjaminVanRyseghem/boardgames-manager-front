import "./home.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Page from "../page";
import React from "react";

export default class Home extends Page {
	title = "Home";

	static key = "home"

	renderFooter() {
		return (
			<div className="footer">
				<div className="logo">
					Provided with <FontAwesomeIcon icon="heart"/> by <span className="font-weight-bold">Benjamin Van Ryseghem</span>
				</div>
			</div>
		);
	}

	renderContent() {
		return "TODO";
	}

	render() {
		return (
			<div className="home">
				<div className={"page-body"}>
					<div className={"page"}>
						{this.renderTitle()}
						<div className="page-content">
							{this.renderContent()}
						</div>
					</div>
				</div>
				{this.renderFooter()}
			</div>
		);
	}
}
