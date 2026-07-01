import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import { protectedRoute } from "./middlewares/authMiddleware.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import friendRoute from "./routes/friendRoute.js";
import messageRoute from "./routes/messageRoute.js";
import conversationRoute from "./routes/conversationRoute.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs"; //dọc dữ liệu Json


// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

//middlewares
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))

// CLOUDINARY Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Swagger
const swaggerDocument = JSON.parse(fs.readFileSync("./src/swagger.json", 'utf8'))
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument))



//public route
app.use("/api/auth", authRoute)

//Private route
app.use(protectedRoute)
app.use("/api/users", userRoute)
app.use("/api/friends", friendRoute)
app.use("/api/messages", messageRoute)
app.use("/api/conversations", conversationRoute)

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
})