import dotenv from 'dotenv';
dotenv.config();

import express, { json } from "express";
import cors from "cors";
import serverless from "serverless-http";
import { authenticateUser } from "./utils/authMiddleware.js";

const app = express();

app.use(cors());
app.use(json());

import uploadRoute from "./routes/uploadImageRoute.js";
import processRoute from "./routes/processImageRoute.js";
import metadataRoute from "./routes/metadataRoute.js";
import deleteImagesRoute from "./routes/deleteImagesRoute.js";

app.use("/upload", authenticateUser, uploadRoute);
app.use("/process", processRoute);
app.use("/metadata", metadataRoute);
app.use("/images", deleteImagesRoute);

const PORT = process.env.PORT || 3001;
// if (process.env.IS_OFFLINE) {
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export const handler = serverless(app);