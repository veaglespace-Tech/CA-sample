import { Router } from "express";
import { listEvents, getEvent, registerForEvent } from "../controllers/public/eventController.js";

export const eventRouter = Router();

eventRouter.get("/events", listEvents);
eventRouter.get("/events/:slug", getEvent);
eventRouter.post("/events/:id/register", registerForEvent);
