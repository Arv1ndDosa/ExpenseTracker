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
      { role: "user", content: promptText },
    ],
    max_tokens: 1500,
    temperature: 0.7,
  };

  try {
    const response = await axios.post(url, body, { headers });
    return response.data.choices[0].message.content;
  } catch (error) {
    throw new Error(error.message || "Request failed");
  }
}
