import { Router } from "express";
import { requireAuth, optionalAuth } from "../middleware/authMiddleware.js";
import {
  initiatePayuPayment,
  handlePayuSuccess,
  handlePayuFailure,
  handlePayuWebhook,
  getPaymentStatus,
} from "../controllers/client/paymentController.js";

export const paymentRouter = Router();

// Initiate payment - optionalAuth (guest users can also pay)
paymentRouter.post("/payment/initiate", optionalAuth, initiatePayuPayment);

// PayU server-to-server webhook (no auth, verified by hash)
paymentRouter.post("/payment/webhook", handlePayuWebhook);

// PayU success/failure redirect pages (form POSTs from PayU)
paymentRouter.post("/payment/success", handlePayuSuccess);
paymentRouter.post("/payment/failure", handlePayuFailure);

// Get payment status for a lead
paymentRouter.get("/payment/status/:leadId", requireAuth, getPaymentStatus);

