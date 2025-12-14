import express, { urlencoded } from 'express'
import { errorHandler } from './utils/errorMiddleware.js';
import userRouter from './routes/user.routes.js'
import cors from 'cors'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

const app = express();

dotenv.config()

app.use(cors({
    origin: process.env.CORS_URL ,
    credentials: true, 
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"]
}))

// Middlewares
app.use(cookieParser())
app.use(express.json({ limit: "16kb" }))
app.use(urlencoded({extended: true, limit: "16kb"}))

app.get("/", (req, res) => {
    res.send("Hello from server")
})

//Routes
app.use("/api/v1/users", userRouter)

app.use(errorHandler)

export { app }