import express from "express";
import cookieParser from "cookie-parser";
import { json } from "body-parser";
import { config } from "dotenv";
import { SessionManager } from "./security/session-manager";
import { AuthManager } from "./security/auth-manager";
import { Connection } from "./database/connection";
import { UserManager } from "./security/user-manager";
import { ItemManager } from "./item/item-manager";
import { CharacterManager } from "./character/character-manager";
import { createSessionHandler, createSessionCookieValidator, createSessionUserValidation } from "./webservice/session-handler";
import { createAuthHandler } from "./webservice/auth-handler";
import { createAllItemsHandler, createNamedItemHandler, createChildItemsHandler } from "./webservice/item-handler";
import { createListCharactersHandler, createGetCharacterHandler, createSaveCharacterHandler, createDeleteCharacterHandler } from "./webservice/character-handler";

config();

const app = express();
app.use(cookieParser());
app.use(json());
const port = 5000;

const connection = new Connection();

const sessionManager = new SessionManager();
const authManager = new AuthManager(connection);
const userManager = new UserManager(connection);
const itemManager = new ItemManager(connection);
const characterManager = new CharacterManager(connection);

const sessionCookieValidator = createSessionCookieValidator();
const sessionUserValidator = createSessionUserValidation(sessionManager);

app.get("/session", createSessionHandler(sessionManager));

app.post("/auth", [sessionCookieValidator, createAuthHandler(sessionManager, authManager, userManager)]);

app.get("/items", [sessionCookieValidator, sessionUserValidator, createAllItemsHandler(itemManager)]);

app.get("/items/:parentPath", [sessionCookieValidator, sessionUserValidator, createChildItemsHandler(itemManager)]);

app.get("/items/:path/:name", [sessionCookieValidator, sessionUserValidator, createNamedItemHandler(itemManager)]);

app.get("/characters", [sessionCookieValidator, sessionUserValidator, createListCharactersHandler(sessionManager, characterManager)]);

app.get("/characters/:key", [sessionCookieValidator, sessionUserValidator, createGetCharacterHandler(sessionManager, characterManager)]);

app.post("/characters/:key", [sessionCookieValidator, sessionUserValidator, createSaveCharacterHandler(sessionManager, characterManager)]);

app.delete("/characters/:key", [sessionCookieValidator, sessionUserValidator, createDeleteCharacterHandler(sessionManager, characterManager)]);

app.listen(port, () => {
	console.log(`cyberpunk-api listening for requests on port ${port}`);
});