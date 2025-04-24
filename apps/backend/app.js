require("dotenv").config();

const { authenticateUser } = require("./utils/authMiddleware");

const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");
const app = express();

app.use(cors());
app.use(express.json());

const uploadRoute = require("./routes/uploadImageRoute");
const processRoute = require("./routes/processImageRoute");
const metadataRoute = require("./routes/metadataRoute");
const deleteImagesRoute = require("./routes/deleteImagesRoute");

app.use("/upload", authenticateUser, uploadRoute);
app.use("/process", processRoute);
app.use("/metadata", metadataRoute);
app.use("/images", deleteImagesRoute);

const PORT = process.env.PORT || 3001;
// if (process.env.IS_OFFLINE) {
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// }

// Wraps the Express app so that AWS Lambda can handle HTTP requests when triggered via API Gateway.
// Instead of running a traditional Express server (app.listen(PORT)), AWS Lambda calls the handler function when it receives a request.
module.exports.handler = serverless(app);