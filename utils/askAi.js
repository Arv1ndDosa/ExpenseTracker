import axios from "axios";
const apiEndpoint = " "; // put link of resource name
const apiKey = " "; // put api key here
const apiVersion = "2024-10-21"; //confirm if this is the current version
const modelDeployment = ""; // put deployment name

export async function askAI(promptText) {
  const url = `${apiEndpoint}openai/deployments/${modelDeployment}/chat/completions?api-version=${apiVersion}`;
  try {
    const response = await axios.post(url,  //need this to be the place where the request is sent
      {                                                    
        messages: [                         //need to make sure that the info is sent
          { role: "assistant", content: "Hello assistant" },
          { role: "user", content: promptText },
        ],
        max_tokens: 150,   //tokens on subscriptions
        temperature: 0.6,  //0-1.0 scale and can adjust to change creativity levels
      },
      {
        headers: { //need to set headers
          "Content-Type": "application/json",
          "apikey": apiKey,
        },
      }
    );
    return response.data.choices[0].message.content;  //should take only the ai's response rather than the whole json paragraph
  } catch (error) {
    throw new Error("Request failed: " + (error.message || "Unknown error")); //should display this if code doesnt work
  }
}
