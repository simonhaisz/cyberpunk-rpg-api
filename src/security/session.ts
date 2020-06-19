import { User } from "./user";

export type Session = {
	id: string,
	user?: User;
}