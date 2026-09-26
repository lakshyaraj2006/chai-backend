import multer from "multer";
import os from "os";
import { NODE_ENV } from "../constants.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, NODE_ENV !== "development" ? os.tmpdir() : "public/temp");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

export { upload };
