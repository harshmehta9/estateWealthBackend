import express, { Application } from "express";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./config/db";
import dotenv from "dotenv";
import superAdminRouter from "./routes/superAdminRoute";
import adminRouter from "./routes/adminRoutes";
import propertyRouter from "./routes/propertyRoutes";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/superadmin", superAdminRouter);
app.use("/admin", adminRouter)
app.use("/properties", propertyRouter)

app.get("/", (req, res) => {
  res.status(200).json("I am Working");
})
// app.use("/users", userRouter);

dotenv.config(); // Load environment variables

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
      // Connect to MongoDB
      await connectDB();
  
      // Start the server only if the DB connection succeeds
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } catch (error) {
      console.error('Failed to start the server:', (error as Error).message);
      process.exit(1); // Exit with failure if connection fails
    }
  };
  
startServer();