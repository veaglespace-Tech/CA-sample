import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { uploadDocument, getMyDocuments, deleteDocument, updateDocument } from "../controllers/client/documentController.js";
import { upload } from "../utils/multer.js";

export const documentRouter = Router();

documentRouter.use(requireAuth);

documentRouter.post("/upload", upload.single("document"), uploadDocument);
documentRouter.get("/my-documents", getMyDocuments);
documentRouter.put("/:id", upload.single("document"), updateDocument);
documentRouter.delete("/:id", deleteDocument);
