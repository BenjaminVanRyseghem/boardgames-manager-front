import "./deleteGameButton.scss";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Interpolate from "components/i18n/interpolate";
import PropTypes from "prop-types";
import React from "react";
import Translate from "components/i18n/translate";

export default class DeleteGameButton extends React.Component {
	static defaultProps = {};

	static propTypes = {
		game: PropTypes.object.isRequired,
		onDelete: PropTypes.func.isRequired
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
					<Translate i18nKey="delete.game.header" name={this.props.game.name()}>Delete $name$</Translate>
				</ModalHeader>
				<ModalBody>
					<Interpolate i18nKey="delete.game.label" name={this.props.game.name()}>
						Are you sure you want to delete <strong>%name%</strong>?
					</Interpolate>
				</ModalBody>
				<ModalFooter>
					<Button color="danger" onClick={() => {
						toggle();
						this.props.onDelete();
					}}>
						<Translate i18nKey="delete.game.button">Delete</Translate>
					</Button>{" "}
					<Button color="secondary" onClick={toggle}><Translate i18nKey="cancel">Cancel</Translate></Button>
				</ModalFooter>
			</Modal>
		);
	}

	render() {
		return (
			<div className="deleteGameButton">
				{this.renderModal()}
				<Button color="danger" onClick={this.toggleModal.bind(this)}>
					<Translate i18nKey="deleteg.game">Delete</Translate>
				</Button>
			</div>
		);
	}
}
