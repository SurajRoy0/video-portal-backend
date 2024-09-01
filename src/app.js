import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
// Middleware to parse incoming JSON payloads and limit the request body size to 16kb
app.use(express.json({ limit: "16kb" }));

// Middleware to parse URL-encoded data from forms, allowing for nested objects,
// and limit the request body size to 16kb
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Middleware to serve static files (e.g., images, CSS, JS) from the "public" directory
app.use(express.static("public")); 

// Middleware to parse cookies from the HTTP request and make them accessible via req.cookies
app.use(cookieParser());


// Routes imports
import userRouter from  "./routes/user.route.js";

//Route Declaration
app.use("/api/v1/users", userRouter);


export { app };
