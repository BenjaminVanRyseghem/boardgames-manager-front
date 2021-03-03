import "./locationsContainer.scss";
import { Button, Form, FormGroup, Label, ModalBody, ModalFooter } from "reactstrap";
import i18n from "i18n/i18n";
import info from "helpers/info";
import Loading from "components/loading/loading";
import Location from "models/location";
import PropTypes from "prop-types";
import React from "react";
import Select from "react-select";
import Translate from "components/i18n/translate";

export default class LocationsContainer extends React.Component {
	static defaultProps = {
		data: undefined,
		error: undefined
	}

	static propTypes = {
		data: PropTypes.array,
		error: PropTypes.object,
		gameLocation: PropTypes.string,
		moveTo: PropTypes.func,
		toggle: PropTypes.func
	};

	state = {
		candidate: undefined
	};

	setCandidate(candidate) {
		this.setState({ candidate });
	}

	componentDidUpdate(prevProps) {
		if (this.props.data && this.state.candidate === undefined) {
			let firstLocation = this.props.data.find((each) => each.id() !== this.props.gameLocation);
			this.setCandidate(firstLocation.id());
		}

		if (prevProps.error !== this.props.error) {
			info.error({
				html: <Translate i18nKey="failedToLoadLocations">Failed to load locations!</Translate>
			});
		}
	}

	render() {
		let { data, error, gameLocation } = this.props;

		if (error) {
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
							<Select
								formatOptionLabel={(location) => location.name()}
								getOptionLabel={(location) => location.name()}
								getOptionValue={(location) => location.id()}
								isOptionDisabled={(location) => location.id() === gameLocation}
								options={data.sort(Location.sortAlphabetically)}
								placeholder={i18n.t("placeholder", "Select...")}
								value={this.state.candidate}
								onChange={(candidate) => this.setCandidate(candidate)}
							/>
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
