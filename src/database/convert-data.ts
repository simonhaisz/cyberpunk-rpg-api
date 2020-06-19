import { isArray, isObject } from "util";

export function convertToDatabaseValue(value: any): string {
	if (isArray(value)) {
		throw new Error(`Array values are not supported for insert`);
	}
	// JSON needs to be quoted like any 'string' value
	if (isObject(value)) {
		return `${escapeQuotes(JSON.stringify(value))}`;
	}
	//all scalar values are text (for now) so always quote the value
	return `${escapeQuotes(value)}`;
}

function escapeQuotes(value: string): string {
	return value.replace(/'/g, "''");
}