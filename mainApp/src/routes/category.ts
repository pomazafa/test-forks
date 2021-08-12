import { Router } from "express";
import CategoryController from "../controllers/CategoryController";
import CategorySubscriberController from "../controllers/CategorySubscriberController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

router.get("/", [checkJwt], CategoryController.listAll);

router.post("/", [checkJwt], CategoryController.newCategory);

router.post("/:id/subscribers", [checkJwt], CategorySubscriberController.newCategorySubscriber);

router.get("/:id/subscribers", [checkJwt], async (req, res) => {
    let categorySubscribers = await CategorySubscriberController.listAll(req.params && req.params.id);
    res.send(categorySubscribers);
});

router.get("/:id/forks", [checkJwt], CategoryController.listAllForks);

export default router;