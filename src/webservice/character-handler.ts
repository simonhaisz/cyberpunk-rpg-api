import { CharacterManager } from "../character/character-manager";
import { ResponseHandler } from "./handler";
import { SessionManager } from "../security/session-manager";
import { getSessionId } from "./session-handler";

export function createListCharactersHandler(sessionManager: SessionManager, characterManager: CharacterManager): ResponseHandler {
	return async (request, response) => {
		const sessionId = getSessionId(request);
		if (!sessionId) {
			console.error(`No session id found after validating session id exists`);
			response.sendStatus(500);
			return;
		}
		const { user } = sessionManager.getSession(sessionId);
		if (!user) {
			console.error(`No user found after validating request authenticated`);
			return;
		}
		const characters = await characterManager.list(user.name);
		const characterNames = characters.map(c => ({
			path: c.path,
			name: c.name
		}));
		response.status(200).json(characterNames);
	};
}

export function createGetCharacterHandler(sessionManager: SessionManager, characterManager: CharacterManager): ResponseHandler {
	return async (request, response) => {
		const sessionId = getSessionId(request);
		if (!sessionId) {
			console.error(`No session id found after validating session id exists`);
			response.sendStatus(500);
			return;
		}
		const { user } = sessionManager.getSession(sessionId);
		if (!user) {
			console.error(`No user found after validating request authenticated`);
			return;
		}
		const { key } = request.params;
		const character = await characterManager.get(user.name, parseInt(key));
		response.status(200).json(character);
	};
}

export function createSaveCharacterHandler(sessionManager: SessionManager, characterManager: CharacterManager): ResponseHandler {
	return async (request, response) => {
		const sessionId = getSessionId(request);
		if (!sessionId) {
			console.error(`No session id found after validating session id exists`);
			response.sendStatus(500);
			return;
		}
		const { user } = sessionManager.getSession(sessionId);
		if (!user) {
			console.error(`No user found after validating request authenticated`);
			return;
		}
		const { key } = request.params;
		const { path, name, data } = request.body;
		await characterManager.save(user.name, parseInt(key), path, name, data);
		response.sendStatus(200);
	}
}

export function createDeleteCharacterHandler(sessionManager: SessionManager, characterManager: CharacterManager): ResponseHandler {
	return async (request, response) => {
		const sessionId = getSessionId(request);
		if (!sessionId) {
			console.error(`No session id found after validating session id exists`);
			response.sendStatus(500);
			return;
		}
		const { user } = sessionManager.getSession(sessionId);
		if (!user) {
			console.error(`No user found after validating request authenticated`);
			return;
		}
		const { key } = request.params;
		await characterManager.delete(user.name, parseInt(key));
		response.sendStatus(200);
	};
}