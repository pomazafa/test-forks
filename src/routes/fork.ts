import { Router } from "express";
import ForkController from "../controllers/ForkController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

router.get("/", [checkJwt], ForkController.listAll);

router.post("/", [checkJwt], ForkController.newFork);

export default router;