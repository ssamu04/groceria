import express from "express"
import dotenv from "dotenv";
import cors from "cors";

import groceriaRoutes from "./routes/groceriaRoutes.js" 
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express()
const PORT = process.env.PORT || 5001;

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);
app.use(express.json());
app.use(rateLimiter);
app.use("/api/groceria", groceriaRoutes);


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server started on PORT:", PORT);
    })
});