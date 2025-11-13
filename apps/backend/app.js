import dotenv from 'dotenv';
dotenv.config();

import express, { json } from "express";
import cors from "cors";
import serverless from "serverless-http";
import { authenticateUser } from "./utils/authMiddleware.js";

const app = express();

app.use(cors());
app.use(json());

import uploadImageRoute from "./routes/images/uploadImageRoute.js";
import deleteImageRoute from "./routes/images/deleteImageRoute.js";
import metadataRoute from "./routes/images/metadataRoute.js";
import analyzeImageRoute from "./routes/images/analyzeImageRoute.js";

const imagesRouter = express.Router();

imagesRouter.use(uploadImageRoute);   // POST /api/images
imagesRouter.use(deleteImageRoute);   // DELETE /api/images/:id
imagesRouter.use(metadataRoute);      // GET /api/images/:id/metadata
imagesRouter.use(analyzeImageRoute);  // POST /api/images/:id/analyze

// 전체 이미지 리소스 그룹 보호
app.use("/api/images", authenticateUser, imagesRouter);

// import uploadRoute from "./routes/uploadImageRoute.js";
// import processRoute from "./routes/processImageRoute.js";
// import metadataRoute from "./routes/metadataRoute.js";
// import deleteImagesRoute from "./routes/deleteImagesRoute.js";
// import llmRoute from "./routes/llmRoute.js";

// app.use("/upload", authenticateUser, uploadRoute);
// app.use("/process", processRoute);
// app.use("/metadata", metadataRoute);
// app.use("/images", deleteImagesRoute);
// app.use("/llm", llmRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export const handler = serverless(app);