import { Pool, QueryResult } from "pg";

export class Connection {

	private readonly pool = new Pool();

	async query(q: string, values: string[] = []): Promise<QueryResult<any>> {
		return this.pool.query(q, values);
	}

	async dispose() {
		await this.pool.end();
	}
}