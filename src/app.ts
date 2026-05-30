import express from "express";
import cors from "cors";
import classroomRoutes from "./routes/classroomRoute";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/classrooms", classroomRoutes);

// Health check endpoint (for testing)
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

export default app;