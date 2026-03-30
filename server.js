import express from "express";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";

const app = express();

// ✅ CORS (must be first)
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://frontend-doc-ten.vercel.app",
    "https://admin-care-connect-sigma.vercel.app"
  ],
  credentials: true,
}));

// ✅ Middleware
app.use(express.json());

// ✅ Safe connection (important for Vercel)
let isConnected = false;

app.use(async (req, res, next) => {
  try {
    if (!isConnected) {
      await connectDB();
      connectCloudinary();
      isConnected = true;
      console.log("✅ DB & Cloudinary Connected");
    }
    next();
  } catch (error) {
    console.error("❌ Connection Error:", error);
    return res.status(500).json({ error: "Server crashed" });
  }
});

// ✅ Routes
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("API Working 🚀");
});

// ✅ EXPORT for Vercel (DO NOT use app.listen)
export default app;
