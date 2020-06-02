import "./moveToButton.scss";
import { Button, Modal, ModalHeader } from "reactstrap";
import PropTypes from "prop-types";
import React from "react";
import Translate from "components/i18n/translate";

export default class MoveToButton extends React.Component {
	static defaultProps = {};

	static propTypes = {
		Locations: PropTypes.node.isRequired
	};

	state = {
		open: false
	};

	toggleModal() {
		this.setState((state) => ({
			open: !state.open
		}));
	}

	renderModal() {
		let toggle = this.toggleModal.bind(this);

		return (
			<Modal className="move-to-modal" isOpen={this.state.open} toggle={toggle}>
				<ModalHeader toggle={toggle}>
					<Translate i18nKey="moveTo">Move to...</Translate>
				</ModalHeader>
				{React.cloneElement(this.props.Locations, { toggle })}
			</Modal>
		);
	}

	render() {
		return (
			<>
				{this.renderModal()}
				<Button className="moveToButton" color="primary" onClick={this.toggleModal.bind(this)}>
					<Translate i18nKey="moveTo">Move to...</Translate>
				</Button>
			</>
		);
	}
}
