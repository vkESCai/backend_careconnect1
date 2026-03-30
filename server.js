import express from "express";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";

const app = express();

// middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://frontend-doc-ten.vercel.app",
    "https://admin-care-connect-sigma.vercel.app"
  ],
  credentials: true,
}));

app.use(express.json());

// ✅ SAFE connection (NO CRASH)
let isConnected = false;

app.use(async (req, res, next) => {
  try {
    if (!isConnected) {
      console.log("Connecting services...");

      await connectDB().catch(err => {
        console.error("❌ DB FAILED:", err.message);
      });

      try {
        connectCloudinary();
      } catch (err) {
        console.error("❌ Cloudinary FAILED:", err.message);
      }

      isConnected = true;
    }

    next();
  } catch (error) {
    console.error("❌ Middleware crash:", error.message);
    next(); // don't block request
  }
});

// routes
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);

// test route
app.get("/", (req, res) => {
  res.send("API Working 🚀");
});

export default app;
