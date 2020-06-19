import { Connection } from "../database/connection";
import { Item } from "./item";


export class ItemManager {

	private readonly connection: Connection;

	constructor(connection: Connection) {
		this.connection = connection;
	}

	async all(): Promise<Item[]> {
		const q = `
SELECT path, name, data
FROM system.item;
		`.trim();
		return this.itemsInner(q, []);
	}

	async get(path: string, name: string): Promise<Item[]> {
		const q = `
SELECT path, name, data
FROM system.item
WHERE path = $1 AND name = $2;
		`.trim();
		const v = [path, name];
		return this.itemsInner(q, v);
	}

	async children(parentPath: string): Promise<Item[]> {
		const q =`
SELECT path, name, data
FROM system.item
WHERE SUBSTRING(path, 1, CHAR_LENGTH($1)) = $1;
		`.trim();
		const v = [parentPath];
		return this.itemsInner(q, v);
	}

	private async itemsInner(query: string, values: any[]): Promise<Item[]> {
		const result = await this.connection.query(query, values);
		const items: Item[] = [];
		for (const row of result.rows) {
			const { path, name, data } = row;
			items.push({
				path,
				name,
				data
			});
		}
		return items;
	}
}