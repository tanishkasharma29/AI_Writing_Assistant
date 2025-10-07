const express = require("express");
const axios = require("axios");
const analyzeRouter = express.Router();

analyzeRouter.post("/", async (req, res) => {
  const { sentence } = req.body;

  if (!sentence) {
    return res.status(400).json({ error: "Sentence is required" });
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
              "You are a helpful assistant that rephrases sentences. Only return the rephrased sentences without any additional comments or context.",
          },
          {
            role: "user",
            content: sentence,
          },
        ],
        max_tokens: 150,
        n: 3,
        stop: null,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const rephrasedSentences = response.data.choices.map((choice) =>
      choice.message.content.trim()
    );

    res.json({ rephrasedSentences });
  } catch (error) {
    console.error("Analyze Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    // Fallback for quota exceeded or API errors
    if (
      error.response?.status === 429 ||
      error.response?.data?.error?.code === "insufficient_quota"
    ) {
      // Simple sentence variations
      const mockSuggestions = [
        sentence.replace(/very/gi, "extremely"),
        sentence.replace(/good/gi, "excellent"),
        sentence.replace(/bad/gi, "poor"),
        sentence.replace(/big/gi, "large"),
        sentence.replace(/small/gi, "tiny"),
      ]
        .filter(
          (suggestion, index, arr) =>
            suggestion !== sentence && arr.indexOf(suggestion) === index
        )
        .slice(0, 3);

      // If no variations found, provide generic alternatives
      if (mockSuggestions.length === 0) {
        mockSuggestions.push(
          `${sentence} (Alternative phrasing)`,
          `Consider: "${sentence.charAt(0).toUpperCase() + sentence.slice(1)}"`,
          `Suggestion: "${sentence.replace(/\.$/, "").trim()}."`
        );
      }

      console.log("✅ Using fallback analyzer");
      return res.json({
        rephrasedSentences: mockSuggestions,
      });
    }

    res.status(500).json({
      error:
        error.response?.data?.error?.message ||
        error.message ||
        "Error analyzing sentence",
    });
  }
});

module.exports = analyzeRouter;
