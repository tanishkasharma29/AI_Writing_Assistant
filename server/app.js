const express = require("express");
const cors = require("cors");
require("dotenv").config(); // ✅ Ensure .env is loaded BEFORE anything else

const analyzeRouter = require("./routes/analyze");
const grammarCheck = require("./routes/grammarChecker");
const spellChecker = require("./routes/spellChecker");

const app = express();
const port = process.env.PORT || 8000;

// CORS configuration for production
const corsOptions = {
  origin: [
    "http://localhost:5173", // Development
    "http://localhost:3000", // Development alternative
    "https://ai-writing-assistant-frontend.onrender.com", // Production frontend
    process.env.CLIENT_URL, // Environment variable for custom domain
  ].filter(Boolean), // Remove any undefined values
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json()); // for parsing application/json

console.log("API Key:", process.env.OPENAI_API_KEY);

// Test route
app.get("/api/test", (req, res) => {
  res.json({
    message: "Server is working!",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/analyze", analyzeRouter);
app.use("/api/grammarcheck", grammarCheck);
app.use("/api/spellcheck", spellChecker);

// ✅ Only one app.listen
app.listen(port, () => {
  console.log(`AI Writing app listening at http://localhost:${port}`);
});
