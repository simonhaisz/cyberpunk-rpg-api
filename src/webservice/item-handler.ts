import { ItemManager } from "../item/item-manager";
import { ResponseHandler } from "./handler";

export function createAllItemsHandler(itemManager: ItemManager): ResponseHandler {
	return async (request, response) => {
		const items = await itemManager.all();
		response.status(200).json(items);
	};
}

export function createChildItemsHandler(itemManager: ItemManager): ResponseHandler {
	return async (request, response) => {
		const { parentPath } = request.params;
		const items = await itemManager.children(parentPath);
		response.status(200).json(items);
	};
}

export function createNamedItemHandler(itemManager: ItemManager): ResponseHandler {
	return async (request, response) => {
		const { path, name } = request.params;
		const items = await itemManager.get(path, name);
		response.status(200).json(items);
	};
}