import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { BearerParser } from 'bearer-token-parser';
import config from "../config/config";
import { parseToken } from "../util/parseToken";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    const token = BearerParser.parseBearerToken(req.headers);
    let jwtPayload;

    try {
        jwtPayload = parseToken(token);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        res.status(401).send();
        return;
    }

    if (!jwtPayload) {
        res.status(401).send();
        return;
    }
    const { userId, username } = jwtPayload;
    const newToken = jwt.sign({ userId, username }, config.jwtSecret, {
        expiresIn: "1h"
    });
    req.userId = userId;
    res.setHeader("token", newToken);

    next();
};