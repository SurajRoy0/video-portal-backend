import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

// Load environment variables from .env file
dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.error(`ERROR: ${err.message}`);
      process.exit(1); // Exit the process on a critical error
    });

    app.listen(port, () => {
      console.log(`Server running at: http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed !!! ", err);
    process.exit(1); // Exit the process if the database connection fails
  });
