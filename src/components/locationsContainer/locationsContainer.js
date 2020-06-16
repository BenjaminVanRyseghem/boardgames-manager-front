import "./locationsContainer.scss";
import { Button, Form, FormGroup, Input, Label, ModalBody, ModalFooter } from "reactstrap";
import info from "helpers/info";
import Loading from "components/loading/loading";
import PropTypes from "prop-types";
import React from "react";
import Translate from "components/i18n/translate";

export default class LocationsContainer extends React.Component {
	static defaultProps = {
		data: undefined,
		error: undefined
	}

	static propTypes = {
		data: PropTypes.array,
		error: PropTypes.bool,
		gameLocation: PropTypes.object,
		moveTo: PropTypes.func,
		toggle: PropTypes.func
	};

	state = {
		candidate: undefined
	};

	setCandidate(candidate) {
		this.setState({ candidate });
	}

	componentDidUpdate() {
		if (this.props.data && this.state.candidate === undefined) {
			let firstLocation = this.props.data.find((each) => each.id !== this.props.gameLocation);
			this.setCandidate(firstLocation.id);
		}
	}

	render() {
		let { data, error, gameLocation } = this.props;

		if (error) {
			info.error({
				html: <Translate i18nKey="failedToLoadLocations">Failed to load locations!</Translate>
			});
			return null;
		}

		if (!data) {
			return <div className="loading"><Loading/></div>;
		}

		if (!data.length) {
			return <div className="no-location"><Translate i18nKey="noLocationFound">No location found!</Translate>
			</div>;
		}

		return (
			<>
				<ModalBody>
					<Form>
						<FormGroup>
							<Label>
								<Translate i18nKey="chooseALocation">Choose a location:</Translate>
							</Label>
							<Input type="select" onChange={(event) => this.setCandidate(event.target.value)}>
								{
									data.map((location) => (
										<option
											key={location.id}
											disabled={location.id === gameLocation}
											value={location.id}
										>
											{location.name}
										</option>
									))
								}
							</Input>
						</FormGroup>
					</Form>
				</ModalBody>
				<ModalFooter>
					<Button color="primary" onClick={() => {
						this.props.toggle();
						this.props.moveTo(this.state.candidate);
					}}>
						<Translate i18nKey="move">Move</Translate>
					</Button>{" "}
					<Button color="secondary" onClick={this.props.toggle}><Translate i18nKey="cancel">Cancel</Translate></Button>
				</ModalFooter>
			</>
		);
	}
}
