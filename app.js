import express from "express";
import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";

// Routers
import userRouter from "./routes/userRoutes.js";
import hospitalRouter from "./routes/hospitalRoutes.js";
import equipmentRouter from "./routes/equipmentRoutes.js";
import maintenanceRouter from "./routes/maintenanceHistoryRoutes.js";

// Error Handling Imports
import AppError from "./utils/appError.js";
import globalErrorHandler from "./controllers/errorController.js";

import cors from "cors";

// Security Dependencies
import compression from "compression";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import hpp from "hpp";

const app = express();



// Load environment variables
dotenv.config({ path: "./config.env" });

// 1) GLOBAL MIDDLEWARES

// CORS configuration for production and local development


app.use(
  cors({
    origin: [
      "https://fydp-resourcehive.vercel.app",
      "https://resourcehive.vercel.app",
      "https://resourcehive-backend.vercel.app", 
      "http://localhost:5173",
      "https://resourcehive-b.vercel.app",
    ],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin"], // ✅ Expanded headers
  })
);
// Serving Static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(`${__dirname}/public`));

// Setting Templating Engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// app.use(
//   cors({
//     origin: [
//       "https://fydp-resourcehive.vercel.app",
//       "https://resourcehive.vercel.app",
//       "http://localhost:5173",
//       "https://resourcehive-b.vercel.app",
//     ],
//     credentials: true,
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// Remove the manual Access-Control-Allow-Origin middleware



// // Preflight OPTIONS request handling
// app.options(
//   "*",
//   cors({
//     origin: [
//       "https://fydp-resourcehive.vercel.app",
//       "https://resourcehive-backend.vercel.app",
//       "http://localhost:3000",
//       "http://localhost:3001",
//       "http://localhost:3002",
//       "http://localhost:3003",
//       "http://localhost:3005",
//       "https://resourcehive.vercel.app",
//       "http://localhost:5173",
//       "https://resourcehive-b.vercel.app",
      
//     ],
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     credentials: true,
//   })
// );


// // Preflight OPTIONS request handling
// app.options("*", cors());

// Set Security HTTP Headers
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 100 requests per hour
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Default route to check the server
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the Resource Hive Backend!");
});

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

// Compression middleware to optimize response size
app.use(compression());

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/hospitals", hospitalRouter);
app.use("/api/v1/equipments", equipmentRouter);
app.use("/api/v1/:hospitalId/:equipmentId/maintenance", maintenanceRouter);
// api/v1/:hospitalId/:equipmentId/maintenance
// Error Handling
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;

// for vercellllllllllllllllllllllllllllll remove this when u see!
