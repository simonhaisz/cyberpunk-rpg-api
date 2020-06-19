import { Connection } from "../database/connection";
import { Character } from "./character";

export class CharacterManager {

	private readonly connection: Connection;

	constructor(connection: Connection) {
		this.connection = connection;
	}

	async list(userName: string): Promise<Character[]> {
		const q =`
SELECT key, path, name, data
FROM system.character
WHERE user_name = $1;
		`.trim();
		const v = [userName];
		const result = await this.connection.query(q, v);
		const characters: Character[] = [];
		for (const row of result.rows) {
			const { key, path, name, data } = row;
			characters.push({
				key,
				path,
				name,
				data
			});
		}
		return characters;
	}

	async get(userName: string, key: number): Promise<Character | null> {
		const q =`
SELECT path, name, data
FROM system.character
WHERE user_name = $1 AND key = $2;
		`.trim();
		const v = [userName, key.toFixed(0)];
		const result = await this.connection.query(q, v);
		if (result.rowCount === 0) {
			return null;
		}
		const { path, name, data } = result.rows[0];
		return {
			key,
			path,
			name,
			data
		};
	}

	async save(userName: string, key: number, path: string, name: string, data: any) {
		const v = [userName, key, path, name, data ];
		const update = `
UPDATE system.character
SET path = $3, name = $4, data = $5
WHERE user_name = $1 AND key = $2;
		`.trim();
		const result = await this.connection.query(update, v);
		if (result.rowCount > 0) {
			// updated exist row
			return;
		}
		const insert = `
INSERT INTO system.character
(user_name, key, path, name, data)
VALUES
($1, $2, $3, $4, $5);
		`.trim();
		await this.connection.query(insert, v);
	}

	async delete(userName: string, key: number) {
		const q = `
DELETE FROM system.character
WHERE user_name = $1 AND key = $2;
		`;
		const v = [userName, key.toFixed(0)];
		await this.connection.query(q, v);
	}
}