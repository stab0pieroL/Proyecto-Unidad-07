"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAuthorization = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
function validateAuthorization(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization)
        return res.status(401).json({ message: "Unauthorized" });
    if (!authorization.startsWith("Bearer "))
        return res.status(401).json({ message: "Token format wrong" });
    const token = authorization.replace("Bearer ", "");
    (0, jsonwebtoken_1.verify)(token, process.env.TOKEN_SECRET, (err, decoded) => {
        console.log(err);
        if (err)
            return res.status(401).json({ message: "Invalid token" });
        req.user = decoded;
        next();
    });
}
exports.validateAuthorization = validateAuthorization;
