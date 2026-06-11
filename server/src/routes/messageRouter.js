import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { 
  sendMessage, 
  getMyMessages, 
  getUnreadCount, 
  markAsRead,
  deleteMessage,
  sendEmailReminder
} from "../controllers/client/messageController.js";
import { upload } from "../utils/multer.js";

const router = express.Router();

// Universal message route - allow optional single attachment
router.post("/send", requireAuth, upload.single("attachment"), sendMessage);
router.post("/email-reminder", requireAuth, sendEmailReminder);

// User routes
router.get("/my-messages", requireAuth, getMyMessages);
router.get("/unread-count", requireAuth, getUnreadCount);
router.put("/:id/read", requireAuth, markAsRead);
router.delete("/:id", requireAuth, deleteMessage);

export default router;
