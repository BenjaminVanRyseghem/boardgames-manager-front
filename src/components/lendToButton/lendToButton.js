import "./lendToButton.scss";
import { Button, Modal, ModalHeader } from "reactstrap";
import PropTypes from "prop-types";
import React from "react";
import Translate from "components/i18n/translate";

export default class LendToButton extends React.Component {
	static defaultProps = {};

	static propTypes = {
		Users: PropTypes.node.isRequired,
		lendTo: PropTypes.func.isRequired,
		lent: PropTypes.bool.isRequired
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
			<Modal className="lend-to-modal" isOpen={this.state.open} toggle={toggle}>
				<ModalHeader toggle={toggle}>
					<Translate i18nKey="lendTo">Lend to...</Translate>
				</ModalHeader>
				{React.cloneElement(this.props.Users, { toggle })}
			</Modal>
		);
	}

	renderWhenLent() {
		return (
			<Button className="lendToButton" color="primary" onClick={() => this.props.lendTo(null)}>
				<Translate i18nKey="getBack">Get back</Translate>
			</Button>
		);
	}

	render() {
		if (this.props.lent) {
			return this.renderWhenLent();
		}

		return (
			<>
				{this.renderModal()}
				<Button className="lendToButton" color="primary" onClick={this.toggleModal.bind(this)}>
					<Translate i18nKey="lendTo">Lend to...</Translate>
				</Button>
			</>
		);
	}
}
