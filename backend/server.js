
import express from "express";
import cors from "cors";
import "dotenv/config";

import { connectDB } from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import projectRouter from "./routes/projectRoutes.js";
import communityRouter from "./routes/communityRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";

const PORT = 4000;
const app = express();

// CORS middleware
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:5174",
            "http://127.0.0.1:5174"
        ],
        credentials: true
    })
);

// Body parser
app.use(express.json({ limit: "1mb" }));

// Test backend
app.get("/", (req, res) => {
    res.status(200).send("API WORKING");
});

// API routes
app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter);
app.use("/api/community", communityRouter);
app.use("/api/payments", paymentRouter);

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        error: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("BACKEND ERROR:", err);

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        error: err.message || "Internal Server Error"
    });
});

// Start server after database connection
const startServer = async () => {
    try {
        await connectDB();

        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`Server Started on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    }
};

startServer();
