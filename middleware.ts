import { Request, Response, NextFunction } from 'express';
import { verify } from "jsonwebtoken";

export function validateAuthorization(req: Request, res:Response, next:NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  if (!authorization.startsWith("Bearer "))
    return res.status(401).json({ message: "Token format wrong" });

  const token = authorization.replace("Bearer ", "");

  verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    console.log(err);
    if (err) return res.status(401).json({ message: "Invalid token" });

    req.user = decoded;
    next();
  });
}