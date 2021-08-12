import { Router } from "express";
import CategoryController from "../controllers/CategoryController";
import CategorySubscriberController from "../controllers/CategorySubscriberController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

router.get("/", [checkJwt], CategoryController.listAll);

router.post("/", [checkJwt], CategoryController.newCategory);

router.post("/:id/subscribers", [checkJwt], CategorySubscriberController.newCategorySubscriber);

router.get("/:id/subscribers", [checkJwt], CategorySubscriberController.listAll);

export default router;