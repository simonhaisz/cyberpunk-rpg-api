import { SessionManager } from "../security/session-manager";
import { Request, CookieOptions } from "express";
import { v4 } from "uuid";
import { RequestValidator, ResponseHandler } from "./handler";

const SESSION_ID_COOKIE = "session_id";
// 4 hours
const SESSION_LENGTH = 1000 * 60 * 60 * 4;

export function getSessionId(request: Request): string | undefined {
	return request.cookies[SESSION_ID_COOKIE];
}

export function createSessionHandler(sessionManager: SessionManager): ResponseHandler {
	return (request, response) => {
		let sessionId = getSessionId(request);
		if (!sessionId) {
			sessionId = v4().toString();
			const cookieOptions: CookieOptions = {
				httpOnly: true,
				secure: false, // FIXME: make this conditional of domain/protocol
				expires: new Date(Date.now() + SESSION_LENGTH)
			};
			response.cookie(SESSION_ID_COOKIE, sessionId, cookieOptions);
		}
		const session = sessionManager.getSession(sessionId);
		response.status(200).json({ user: session.user });
	}
}

export function createSessionCookieValidator(): RequestValidator {
	return (request, response, next) => {
		const sessionId = getSessionId(request);
		if (sessionId) {
			next();
		} else {
			response.status(400).json({ message: "Session id must be provided" });
		}
	}
}

export function createSessionUserValidation(sessionManager: SessionManager): RequestValidator {
	return (request, response, next) => {
		const sessionId = getSessionId(request);
		if (!sessionId) {
			console.error(`No session id found after validating session id exists`);
			response.sendStatus(500);
			return;
		}
		const session = sessionManager.getSession(sessionId);
		if (session.user) {
			next();
		} else {
			response.status(401).json({ message: "Session is not authenticated" });
		}
	}
}