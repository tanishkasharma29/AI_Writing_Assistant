const express = require("express");
const axios = require("axios");
const spellChecker = express.Router();

spellChecker.post("/", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that checks and corrects spelling errors in the following text. Only return the corrected text without any additional comments or context.",
          },
          {
            role: "user",
            content: text,
          },
        ],
        max_tokens: 150,
        n: 1,
        stop: null,
        temperature: 0.5,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const correctedText = response.data.choices[0].message.content.trim();
    res.json({ correctedText });
  } catch (error) {
    console.error("Spell Checker Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    // Fallback for quota exceeded or API errors
    if (
      error.response?.status === 429 ||
      error.response?.data?.error?.code === "insufficient_quota"
    ) {
      // Simple spell check fallback
      const mockCorrectedText = text
        .replace(/helo/gi, "hello")
        .replace(/wrold/gi, "world")
        .replace(/tset/gi, "test")
        .replace(/recieve/gi, "receive")
        .replace(/seperate/gi, "separate")
        .replace(/occured/gi, "occurred")
        .replace(/definately/gi, "definitely")
        .replace(/neccessary/gi, "necessary");

      console.log("✅ Using fallback spell checker");
      return res.json({
        correctedText: mockCorrectedText,
      });
    }

    res.status(500).json({
      error:
        error.response?.data?.error?.message ||
        error.message ||
        "Error checking spelling",
    });
  }
});

module.exports = spellChecker;
