import { AuthManager } from "../security/auth-manager";
import { SessionManager } from "../security/session-manager";
import { getSessionId } from "./session-handler";
import { UserManager } from "../security/user-manager";
import { ResponseHandler } from "./handler";

export function createAuthHandler(sessionManager: SessionManager, authManager: AuthManager, userManager: UserManager): ResponseHandler {
	return (request, response) => {
		const { user, password } = request.body;
		if (!user) {
			response.status(400).json({ message: "Name is required for authentication" });
		}
		if (!password) {
			response.status(400).json({ message: "Password is required for authentication" });
		}
		const sessionId = getSessionId(request);
		if (!sessionId) {
			console.error(`No session id found after validating session id exists`);
			response.sendStatus(500);
			return;
		}
		const session = sessionManager.getSession(sessionId);
		try {
			authManager.authenticate(user, password);
			// can be async because we only need the user set for the next request
			userManager.get(user)
				.then(user => {
					session.user = user;
					response.status(200).json({ success: true, user });
				})
				.catch(error => {
					console.error(`Error retrieving user '${user}': ${error.message}\n${error.stack}`)
					// re-throw to get error response to user
					throw error;
				});
	
		} catch (error) {
			response.status(200).json({ success: false });
		}
	}
}