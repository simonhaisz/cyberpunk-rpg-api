import { randomBytes, createHash } from "crypto";
import { Connection } from "../database/connection";
import { hashPassword } from "./password";

export class AuthManager {

	private readonly connection: Connection;

	constructor(connection: Connection) {
		this.connection = connection;
	}

	async authenticate(userName: string, password: string) {
		const q = `
SELECT name, password_salt, password_hash
FROM system.user
WHERE LOWER(name) = LOWER($1);
		`.trim();
		const v = [userName];
		const result = await this.connection.query(q, v);
		if (result.rowCount === 0) {
			throw new Error(`Bad user name or password`);
		}
		const passwordSalt = result.rows[0].password_salt;
		const passwordHash = result.rows[0].password_hash;
		
		const validationHash = hashPassword(password, passwordSalt);
		if (validationHash !== passwordHash) {
			throw new Error(`Bad user name or password`);
		}
	}
}