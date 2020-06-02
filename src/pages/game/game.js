import "./game.scss";
import { Button, Form, FormGroup, Input, Label, ModalBody, ModalFooter } from "reactstrap";
import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import GameInfo from "components/gameInfo/gameInfo";
import info from "helpers/info";
import LendToButton from "components/lendToButton/lendToButton";
import Loading from "components/loading/loading";
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
		return <div className="no-game"><Translate i18nKey="noGameFound">No game found!</Translate></div>;
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

	return (
		<div className="game-container">
			<GameInfo game={data}/>
			<div className="actions">
				<div className="action lend">
					<LendToButton
						fetch={fetch}
						lendTo={lendTo}
						lent={!!data.borrowed}
						Users={<Users fetch={fetch} lendTo={lendTo}/>}
					/>
				</div>
				<div className="action move">
					<Button color="primary">
						<Translate i18nKey="moveTo">Move to...</Translate>
					</Button>
				</div>
				<div className="action delete">
					<Button color="danger">
						<Translate i18nKey="deleteGame">Delete</Translate>
					</Button>
				</div>
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
