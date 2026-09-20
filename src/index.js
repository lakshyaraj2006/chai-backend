import "dotenv/config";

import connectDB from "./db/index.js"
import { app } from "./app.js";
import { PORT } from "./constants.js";

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at port ${PORT}`);
    })
})
.catch((err) => {
    console.log("MongoDB connection failed !!! ", err);
    
})