import { Request } from "express";

export interface CustomRequest extends Request {
    user?: { id: string, password?: string, role: "Admin" | "User" };
}