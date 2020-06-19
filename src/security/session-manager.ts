import { v4 } from "uuid";
import { AuthManager } from "./auth-manager";
import { Session } from "./session";

export class SessionManager {
	private readonly sessions = new Map<string,Session>();

	getSession(id: string): Session {
		let session = this.sessions.get(id);
		if (!session) {
			session = {
				id: v4().toString()
			}
			this.sessions.set(id, session);
		}
		return session;
	}
}