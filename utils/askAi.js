import axios from 'axios';

const endpoint = "https://expense-tracker-chat-bot.openai.azure.com/";
const apiKey = "8RDzYxVq5Nguh0ANR0zpwxAf4Ut8kfALEFQZVvdhT6n0FFtHqlkWJQQJ99BJACHYHv6XJ3w3AAABACOG2DbE";
const apiVersion = "2025-01-01-preview";
const deployment = "gpt-mini-expensetracker";

export async function askAI(promptText) {
  const url = `${endpoint}openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
  const headers = {
    "Content-Type": "application/json",
    "api-key": apiKey,
  };
  const body = {
    messages: [
      { role: "system", content: "You are a helpful assistant that gives financial insights." },
      { role: "user", content: promptText }
    ],
    temperature: 1,
    max_completion_tokens: 1500,
  };

  try {
    const response = await axios.post(url, body, { headers });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Azure AI Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || error.message || "Request failed");
  }
}
