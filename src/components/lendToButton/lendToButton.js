import "./lendToButton.scss";
import { Button } from "reactstrap";
import PropTypes from "prop-types";
import React from "react";
import Translate from "../i18n/translate";

export default class LendToButton extends React.Component {
	static defaultProps = {};

	static propTypes = {};

	state = {};

	render() {
		return (
			<Button className="lendToButton" color="primary">
				<Translate i18nKey="lentTo">Lent to...</Translate>
			</Button>
		);
	}
}
