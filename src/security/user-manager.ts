import { Connection } from "../database/connection";
import { User } from "./user";

const ADMIN_PERMISSION_NAME = "admin";
const GAME_MASTER_PERMISSION_NAME = "game_master";

export class UserManager {
	private readonly connection: Connection;

	constructor(connection: Connection) {
		this.connection = connection;
	}

	async get(userName: string): Promise<User> {
		// NOTE:
		// adding this complexity was probably a bad idea
		// should have just put these as properties on the system.user table and handled NULL values...
		const q = `
SELECT system.user.name as name, system.permission.name as permission
FROM system.user LEFT JOIN system.permission ON system.user.name = system.permission.user_name
WHERE LOWER(system.user.name) = LOWER($1);
		`.trim();
		const v = [userName];
		const result = await this.connection.query(q, v);
		if (result.rowCount === 0) {
			throw new Error(`Could not find user with name '${userName}'`);
		}
		// user exists, now iterate over any permissions
		let admin = false;
		let gameMaster = false;
		for (const row of result.rows) {
			if (row.permission === null) {
				// because of the left-join a user with no permissions will have a null value in the permission column
				continue;
			}
			switch (row.permission) {
				case ADMIN_PERMISSION_NAME:
					admin = true;
					break;
				case GAME_MASTER_PERMISSION_NAME:
					gameMaster = true;
					break;
			}
		}
		const user: User = {
			name: userName,
			admin,
			gameMaster
		};
		return user;
	}
}