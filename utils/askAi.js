









































// import axios from 'axios';
// import { HUGGINGFACE_API_KEY } from '@env';

// // You can use a light model like "mistralai/Mistral-7B-Instruct-v0.2" or "google/gemma-2b-it"
// const MODEL = 'HuggingFaceH4/zephyr-7b-beta';

// // Optional: warm-up call so the model loads faster when the app starts
// export const warmUpAI = async () => {
//   try {
//     console.log('Warming up Hugging Face model...');
//     const response = await axios.post(
//       `https://api-inference.huggingface.co/models/${MODEL}`,
//       { inputs: "Hello" },
//       { headers: { Authorization: `Bearer ${HUGGINGFACE_API_KEY}` }, timeout: 15000 }
//     );
//     console.log('Warm-up successful ✅');
//   } catch (error) {
//     console.warn('Warm-up failed ❌', error.message);
//   }
// };

// export const askAI = async (userMessage) => {
//   console.log('Sending to Hugging Face:', userMessage);

//   try {
//     const response = await axios.post(
//       `https://api-inference.huggingface.co/models/${MODEL}`,
//       { inputs: userMessage },
//       {
//         headers: {
//           Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
//           'Content-Type': 'application/json',
//         },
//         timeout: 20000,
//       }
//     );

//     // Hugging Face responses vary by model — check both possible formats
//     const reply =
//       response.data?.[0]?.generated_text ||
//       response.data?.generated_text ||
//       'Sorry, no response from AI.';

//     console.log('AI Response:', reply);
//     return reply;
//   } catch (error) {
//     console.error('AI Error:', error.message);
//     return 'Sorry, something went wrong. Please try again later.';
//   }
// };
