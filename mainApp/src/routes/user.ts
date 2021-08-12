import { Router } from "express";
import UserController from "../controllers/UserController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

router.get("/", [checkJwt], UserController.listAll);

router.get(
    "/:id([0-9]+)",
    [checkJwt],
    UserController.getOneById
);

router.post("/", UserController.newUser);

export default router;