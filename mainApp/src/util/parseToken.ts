import * as jwt from "jsonwebtoken";
import config from "../config/config";

export const parseToken = (token: string,) => {
    let jwtPayload;

    try {
        jwtPayload = <any>jwt.verify(token, config.jwtSecret);
        return jwtPayload;
    } catch (error) {
        return null
    }
};