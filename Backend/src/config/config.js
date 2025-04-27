import { config } from "dotenv";
config();


const _config = {
    PORT: process.env.PORT || 3000,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || "",
    GOOGLE_SECRET_KEY: process.env.GOOGLE_SECRET_KEY || "",
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/yourdb",
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_GEMINI_API_KEY: process.env.GOOGLE_GEMINI_API_KEY || "",
}


export default Object.freeze(_config);