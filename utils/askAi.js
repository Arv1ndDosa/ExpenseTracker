import axios from "axios";
const apiEndpoint = "https://expense-tracker-chat-bot.openai.azure.com/";
const apiKey = "8RDzYxVq5Nguh0ANR0zpwxAf4Ut8kfALEFQZVvdhT6n0FFtHqlkWJQQJ99BJACHYHv6XJ3w3AAABACOG2DbE";
const apiVersion = "2025-08-07";
const modelDeployment = "gpt-mini-expensetracker";
const modelName = "gpt-5-mini";
export async function askAI(promptText) {
  const url = `${apiEndpoint}openai/deployments/${modelDeployment}/chat/completions?api-version=${apiVersion}`;
  const headers = { 'Content-Type': 'application/json', 'api-key': apiKey};
  const body = {
    model: modelName,
    messages: [
      { role: 'Assistant', content: 'Hello Assistant!' },
      { role: 'user', content: promptText }
    ],
    max_tokens: 150,
    temperature: 0.6
  };
  try {
    const res = await axios.post(url, body, { headers });
    return res.data.choices[0].message.content;
  } catch (e) {
    throw new Error(e.message || 'Request failed');
  }
}
