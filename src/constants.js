export const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/";
export const DB_NAME = "videotube";
export const PORT = 8080 || process.env.PORT;
export const CORS_ORIGINS = process.env.CORS_ORIGINS
? process.env.CORS_ORIGINS.split(/\s*,\s*/).filter(Boolean)
: "*";