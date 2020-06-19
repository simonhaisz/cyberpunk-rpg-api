import { Request, Response } from "express";

export type ResponseHandler = (request: Request, response: Response) => void;

export type RequestValidator = (request: Request, response: Response, next: () => void) => void;