import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";

import { User } from "../entity/User";
import config from "../config/config";
// import { parseToken } from "../util/parseToken";

class AuthController {
    static login = async (req: Request, res: Response) => {
        let { username, password } = req.body;
        if (!(username && password)) {
            res.status(400).send();
            return
        }

        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({ where: { username } });
        } catch (error) {
            res.status(401).send();
            return
        }

        if (!user.checkIfUnencryptedPasswordIsValid(password)) {
            res.status(401).send();
            return;
        }

        const token = jwt.sign(
            { userId: user.id, username: user.username },
            config.jwtSecret,
            { expiresIn: "1h" }
        );
        // const refreshToken = jwt.sign(
        //     { userId: user.id, username: user.username },
        //     config.jwtSecret,
        //     { expiresIn: '6h' });

        res.send({
            token,
            // refreshToken 
        });
    };

    // static refresh = async (req: Request, res: Response) => {
    //     let { refreshToken } = req.body;
    //     if (!refreshToken) {
    //         res.status(400).send();
    //         return
    //     }
    //     let jwtPayload = parseToken(refreshToken)
    //     if (!jwtPayload) {
    //         res.status(400).send();
    //         return
    //     }

    //     let { username } = jwtPayload

    //     const userRepository = getRepository(User);
    //     let user: User;
    //     try {
    //         user = await userRepository.findOneOrFail({ where: { username } });
    //     } catch (error) {
    //         res.status(401).send();
    //     }

    //     const token = jwt.sign(
    //         { userId: user.id, username: user.username },
    //         config.jwtSecret,
    //         { expiresIn: "1h" }
    //     );

    //     refreshToken = jwt.sign(
    //         { userId: user.id, username: user.username },
    //         config.jwtSecret,
    //         { expiresIn: '6h' });

    //     res.send({ token, refreshToken });
    // };
}
export default AuthController;