import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key is missing or invalid" },
      { status: 500 }
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    // Retrieve the generative model
    const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Define the prompt
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    // Generate content using the model
    const result = await model.generateContent(prompt);

    if (!result || !result.response) {
      throw new Error("Failed to generate a response from the model.");
    }

    // Parse the response text
    const responseText = await result.response.text();

    // Return the response as JSON
    return NextResponse.json({ questions: responseText });
  } catch (error) {
    console.error("Error during request processing:", error);

    // Return error response
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
