import dns from "node:dns/promises"
dns.setServers(['1.1.1.1', '8.8.8.8']);

import mongoose from "mongoose";
import { MONGODB_URI, DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`);
        console.log(`MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);

    } catch (error) {
        console.error("MONGODB connection FAILED");
        console.error(error);
        process.exit(1);
    }
}

export default connectDB;