import { Router } from "express";
import auth from "./auth";
import user from "./user";
import fork from "./fork";
import category from "./category";

const routes = Router();

routes.use("/auth", auth);
routes.use("/users", user);
routes.use("/forks", fork);
routes.use("/categories", category);

export default routes;