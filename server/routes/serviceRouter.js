import { Router } from "express";
import { listServices, getService } from "../controllers/public/serviceController.js";

export const serviceRouter = Router();

serviceRouter.get("/services", listServices);
serviceRouter.get("/services/:slug", getService);
