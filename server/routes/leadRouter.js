import { Router } from "express";
import {
  createConsultation,
  createContact,
  createTalkToExpert,
  createRegistration,
  listLeads,
  updateLeadStatus,
  addLeadNote,
  updateRegistrationNextStep,
  completeRegistrationPayment,
  getMyServices,
} from "../controllers/admin/leadController.js";
import { requireAuth, requireRoles, optionalAuth, requireAdminPermission } from "../middleware/authMiddleware.js";
import {
  validateLeadBody,
  validateExpertBody,
  validateRegistrationBody,
  validateNextStepBody,
} from "../middleware/validateRequest.js";

export const leadRouter = Router();

leadRouter.post("/consult", optionalAuth, validateLeadBody, createConsultation);
leadRouter.post("/contact", optionalAuth, validateLeadBody, createContact);
leadRouter.post("/talk-to-expert", optionalAuth, validateExpertBody, createTalkToExpert);

leadRouter.post("/registration", optionalAuth, validateRegistrationBody, createRegistration);
leadRouter.put("/registration/:id/next-step", validateNextStepBody, updateRegistrationNextStep);
leadRouter.put("/registration/:id/payment", completeRegistrationPayment);
leadRouter.get("/leads/my-services", requireAuth, getMyServices);

// Admin routes
leadRouter.get("/leads", requireAuth, requireRoles(["ADMIN", "SUPER_ADMIN"]), requireAdminPermission("leads", "view"), listLeads);
leadRouter.put("/leads/:id/status", requireAuth, requireRoles(["ADMIN", "SUPER_ADMIN"]), updateLeadStatus);
leadRouter.post("/leads/:id/notes", requireAuth, requireRoles(["ADMIN", "SUPER_ADMIN"]), requireAdminPermission("leads", "addNotes"), addLeadNote);
