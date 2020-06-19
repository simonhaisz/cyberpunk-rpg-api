import { randomBytes, createHash } from "crypto";

export function generatePasswordSalt(): string {
	const salt = randomBytes(8).toString("hex");
	return salt;
}

export function hashPassword(password: string, salt: string): string {
	const sha256 = createHash("sha256");
	sha256.update(password+salt);
	const hash = sha256.digest("hex");
	return hash;
}