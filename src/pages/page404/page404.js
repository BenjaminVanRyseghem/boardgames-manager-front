import "./page404.scss";
import { Col, Container, Row } from "reactstrap";
import cube from "./assets/cube.gif";
import Page from "../page";
import React from "react";

export default class Page404 extends Page {
	static key = "not-found";

	title = () => "Missing page";

	renderContent() {
		return (
			<Container>
				<Row>
					<Col lg={{
						size: 6,
						offset: 3
					}} md={12}>
						<div className="cube">
							<img alt="cube" src={cube}/>
						</div>
						<p>{"The page you are trying to visit doesn't exist."}</p>
						<p>{"You should go"}
							<button className="back-link" onClick={() => window.history.back()}>{"back"}</button>
							{"!"}
						</p>
					</Col>
				</Row>
			</Container>
		);
	}
}
