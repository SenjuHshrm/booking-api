import { Request } from "express";
import { TokenPayload } from "interfaces/token.interface";
import jwt from "jsonwebtoken";

export const getToken = (req: Request): TokenPayload | null => {
  const authorization = req.headers["authorization"];
  const token = authorization?.split(" ").pop();
  return token ? (jwt.decode(token) as TokenPayload | null) : null;
};
