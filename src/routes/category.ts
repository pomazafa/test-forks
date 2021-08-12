import { Router } from "express";
import CategoryController from "../controllers/CategoryController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

router.get("/", [checkJwt], CategoryController.listAll);

router.post("/", [checkJwt], CategoryController.newCategory);

export default router;