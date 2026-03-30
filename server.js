import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import adminRouter from "./routes/adminRoute.js"

// app config
const app = express()
const port = process.env.PORT || 4000

connectDB()
connectCloudinary()

// ✅ CORS must be FIRST before everything
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://frontend-doc-ten.vercel.app',
    'https://admin-care-connect-sigma.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token'],
}))

// middlewares
app.use(express.json())

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/doctor", doctorRouter)

app.get("/", (req, res) => {
  res.send("API Working")
})

// ✅ Export for Vercel (serverless) instead of app.listen
export default app  // ES module syntax (since you're using import/export)
