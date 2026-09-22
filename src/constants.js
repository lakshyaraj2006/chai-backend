export const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/";
export const DB_NAME = "videotube";
export const PORT = 8080 || process.env.PORT;
export const CORS_ORIGINS = process.env.CORS_ORIGINS
? process.env.CORS_ORIGINS.split(/\s*,\s*/).filter(Boolean)
: "*";
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;