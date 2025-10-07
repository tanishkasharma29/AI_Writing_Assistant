const express = require("express");
const axios = require("axios");
const grammarCheck = express.Router();

grammarCheck.post("/", async (req, res) => {
  const { text } = req.body;
  console.log("🎯 Grammar check request received:", text);

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  // Apply grammar corrections first
  let correctedText = text
    .replace(/\byou name are/gi, "Your name is") // Fix "you name are" -> "Your name is"
    .replace(/\byou name is/gi, "Your name is") // Fix "you name is" -> "Your name is"
    .replace(/my name are/gi, "My name is")
    .replace(
      /\b(his|her|its|your|our|their)\s+name\s+are\b/gi,
      (match, pronoun) => {
        return `${
          pronoun.charAt(0).toUpperCase() + pronoun.slice(1).toLowerCase()
        } name is`;
      }
    )
    .replace(
      /\b(I|you|we|they)\s+is\b/gi,
      (match, subject) => `${subject.toLowerCase()} are`
    )
    .replace(
      /\b(he|she|it)\s+are\b/gi,
      (match, subject) => `${subject.toLowerCase()} is`
    )
    .replace(/\bi\s/g, "I ")
    .replace(/\.\s*([a-z])/g, (match, letter) => `. ${letter.toUpperCase()}`)
    .replace(/^([a-z])/, (match, letter) => letter.toUpperCase())
    .replace(/\s+/g, " ")
    .trim();

  console.log("� After grammar correction:", correctedText);

  // If we have quota, try OpenAI for additional improvements
  if (correctedText !== text) {
    console.log("✅ Grammar corrections applied, returning result");
    return res.json({ correctedText });
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
              "You are a helpful assistant that checks and corrects grammar errors in the following text. Only return the corrected text without any additional comments or context.",
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

    let correctedText = response.data.choices[0].message.content.trim();
    console.log("🔍 OpenAI Response:", correctedText);

    // Apply additional grammar rules as post-processing
    const originalText = correctedText;
    correctedText = correctedText
      .replace(/my name are/gi, "My name is")
      .replace(
        /\b(his|her|its|your|our|their)\s+name\s+are\b/gi,
        (match, pronoun) => {
          return `${
            pronoun.charAt(0).toUpperCase() + pronoun.slice(1).toLowerCase()
          } name is`;
        }
      )
      .replace(
        /\b(I|you|we|they)\s+is\b/gi,
        (match, subject) => `${subject.toLowerCase()} are`
      )
      .replace(
        /\b(he|she|it)\s+are\b/gi,
        (match, subject) => `${subject.toLowerCase()} is`
      );

    console.log("🔍 After post-processing:", correctedText);
    console.log("🔍 Changed:", originalText !== correctedText);

    res.json({ correctedText });
  } catch (error) {
    console.error("Grammar Checker Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    // Fallback for quota exceeded or API errors
    if (
      error.response?.status === 429 ||
      error.response?.data?.error?.code === "insufficient_quota"
    ) {
      // Simple grammar corrections
      let mockCorrectedText = text
        .replace(/\bi\s/g, "I ") // lowercase i to uppercase I
        .replace(/my name are/gi, "My name is") // Fix subject-verb agreement
        .replace(
          /\b(his|her|its|your|our|their)\s+name\s+are\b/gi,
          (match, pronoun) => {
            return `${
              pronoun.charAt(0).toUpperCase() + pronoun.slice(1).toLowerCase()
            } name is`;
          }
        ) // Fix other name constructions
        .replace(
          /\b(I|you|we|they)\s+is\b/gi,
          (match, subject) => `${subject} are`
        )
        .replace(/\b(he|she|it)\s+are\b/gi, (match, subject) => `${subject} is`)
        .replace(
          /\.\s*([a-z])/g,
          (match, letter) => `. ${letter.toUpperCase()}`
        ) // Capitalize after periods
        .replace(/^([a-z])/, (match, letter) => letter.toUpperCase()) // Capitalize first letter
        .replace(/\s+/g, " ") // Remove extra spaces
        .trim();

      console.log("✅ Using fallback grammar checker");
      return res.json({
        correctedText: mockCorrectedText,
      });
    }

    res.status(500).json({
      error:
        error.response?.data?.error?.message ||
        error.message ||
        "Error checking grammar",
    });
  }
});

module.exports = grammarCheck;
