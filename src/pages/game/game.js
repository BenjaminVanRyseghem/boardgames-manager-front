import "./game.scss";
import { Button, Form, FormGroup, Input, Label, ModalBody, ModalFooter } from "reactstrap";
import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import GameInfo from "components/gameInfo/gameInfo";
import globalState from "models/globalState";
import info from "helpers/info";
import LendToButton from "components/lendToButton/lendToButton";
import Loading from "components/loading/loading";
import MoveToButton from "../../components/moveToButton/moveToButton";
import Page from "../page";
import PropTypes from "prop-types";
import Translate from "components/i18n/translate";

function Users({ toggle, fetch, lendTo }) { // eslint-disable-line react/prop-types
	let { data, error } = useSWR("/api/v1/user", fetch);
	const [candidate, setCandidate] = useState(undefined);

	if (error) {
		info.error({
			html: <Translate i18nKey="failedToLoadUsers">Failed to load users!</Translate>
		});
		return null;
	}

	if (!data) {
		return <div className="loading"><Loading/></div>;
	}

	if (!data.length) {
		return <div className="no-user"><Translate i18nKey="noUserFound">No user found!</Translate></div>;
	}

	if (candidate === undefined) {
		setCandidate(data[0].id);
	}

	return (
		<>
			<ModalBody>
				<Form>
					<FormGroup>
						<Label>
							<Translate i18nKey="chooseAUser">Choose a user:</Translate>
						</Label>
						<Input type="select" onChange={(event) => setCandidate(event.target.value)}>
							{
								data.map((user) => <option key={user.id} value={user.id}>
									{`${user.firstName} ${user.lastName}`}
								</option>)
							}
						</Input>
					</FormGroup>
				</Form>
			</ModalBody>
			<ModalFooter>
				<Button color="primary" onClick={() => {
					toggle();
					lendTo(candidate);
				}}>
					<Translate i18nKey="lend">Lend</Translate>
				</Button>{" "}
				<Button color="secondary" onClick={toggle}><Translate i18nKey="cancel">Cancel</Translate></Button>
			</ModalFooter>
		</>
	);
}

function Locations({ toggle, fetch, moveTo, gameLocation }) { // eslint-disable-line react/prop-types
	let { data, error } = useSWR("/api/v1/location", fetch);
	const [candidate, setCandidate] = useState(undefined);

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
		return <div className="no-location"><Translate i18nKey="noLocationFound">No location found!</Translate></div>;
	}

	if (candidate === undefined) {
		let firstLocation = data.find((each) => each.id !== gameLocation);
		setCandidate(firstLocation.id);
	}

	return (
		<>
			<ModalBody>
				<Form>
					<FormGroup>
						<Label>
							<Translate i18nKey="chooseALocation">Choose a location:</Translate>
						</Label>
						<Input type="select" onChange={(event) => setCandidate(event.target.value)}>
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
					toggle();
					moveTo(candidate);
				}}>
					<Translate i18nKey="move">Move</Translate>
				</Button>{" "}
				<Button color="secondary" onClick={toggle}><Translate i18nKey="cancel">Cancel</Translate></Button>
			</ModalFooter>
		</>
	);
}

function GameContainer({ id, fetch }) { // eslint-disable-line react/prop-types
	const { data, error } = useSWR(`/api/v1/game/${id}`, fetch);

	if (error) {
		info.error({
			html: <Translate i18nKey="failedToLoadGame">Failed to load game!</Translate>
		});
		return null;
	}
	if (data === null) {
		return <div><Translate i18nKey="noGameFound">No game found!</Translate></div>;
	}

	if (!data) {
		return <div><Loading/></div>;
	}

	function lendTo(borrowed) {
		if (!globalState.user().canLendGame(data)) {
			info.Error({
				title: <Translate i18nKey="error">Error</Translate>,
				html: <Translate i18nKey="unauthorizedAction">
					{"Unauthorized action"}
				</Translate>
			});
			return;
		}

		fetch(`/api/v1/game/${data.id}`, {
			method: "PUT",
			body: {
				borrowed
			}
		})
			.then((game) => mutate(`/api/v1/game/${id}`, game, false))
			.then(() => {
				if (borrowed) {
					info.success({
						title: <Translate i18nKey="success">Success</Translate>,
						html: <Translate i18nKey="gameLentSuccessfully">
							{"Game successfully lent"}
						</Translate>
					});
				} else {
					info.success({
						title: <Translate i18nKey="success">Success</Translate>,
						html: <Translate i18nKey="gameRetrievedSuccessfully">
							{"Game successfully retrieved"}
						</Translate>
					});
				}
			});
	}

	function moveTo(location) {
		if (!globalState.user().canMoveGame(data)) {
			info.Error({
				title: <Translate i18nKey="error">Error</Translate>,
				html: <Translate i18nKey="unauthorizedAction">
					{"Unauthorized action"}
				</Translate>
			});
			return;
		}

		fetch(`/api/v1/game/${data.id}`, {
			method: "PUT",
			body: {
				location
			}
		})
			.then((game) => mutate(`/api/v1/game/${id}`, game, false))
			.then(() => {
				info.success({
					title: <Translate i18nKey="success">Success</Translate>,
					html: <Translate i18nKey="gameMovedSuccessfully">
						{"Game successfully moved"}
					</Translate>
				});
			});

	}

	return (
		<div className="game-container">
			<GameInfo game={data}/>
			<div className="actions">
				{globalState.user().canLendGame(data) && <div className="action lend">
					<LendToButton
						fetch={fetch}
						lendTo={lendTo}
						lent={!!data.borrowed}
						Users={<Users fetch={fetch} lendTo={lendTo}/>}
					/>
				</div>}
				{globalState.user().canMoveGame(data) && <div className="action move">
					<MoveToButton
						fetch={fetch}
						Locations={<Locations fetch={fetch} gameLocation={data.location.id} moveTo={moveTo}/>}
					/>
				</div>}
				{globalState.user().canDeleteGame(data) && <div className="action delete">
					<Button color="danger">
						<Translate i18nKey="deleteGame">Delete</Translate>
					</Button>
				</div>}
			</div>
		</div>
	);
}

export default class Game extends Page {
	static defaultProps = {};

	static propTypes = {
		id: PropTypes.string.isRequired
	};

	renderContent() {
		return (
			<div className="game">
				<GameContainer fetch={this.fetch.bind(this)} id={this.props.id}/>
			</div>
		);
	}
}
