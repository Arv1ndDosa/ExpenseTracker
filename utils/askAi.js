import axios from 'axios';
import { OPENAI_API_KEY } from '@env';

console.log('Loaded API Key:', OPENAI_API_KEY);

export const askAI = async (userMessage) => {
  console.log('User Message:', userMessage);
  console.log('API Key Loaded:', OPENAI_API_KEY);

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userMessage }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        timeout: 10000, // Add 10-second timeout to avoid spinning forever
      }
    );

    const reply = response.data.choices[0].message.content.trim();
    console.log('AI Response:', reply);
    return reply;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out');
    } else {
      console.error('Error calling OpenAI:', error.response?.data || error.message);
    }
    return 'Sorry, something went wrong. Please try again later.';
  }
};

