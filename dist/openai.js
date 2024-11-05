import { OpenAI } from 'openai'; // Correct OpenAI package import
import dotenv from 'dotenv';
// Initialize dotenv to access .env variables
dotenv.config();
// Set up OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    // Optional configurations (you can add your preferred options)
    baseURL: 'https://api.openai.com/v1',
});
// Helper function to generate the sports announcer forecast
export const generateAnnouncerForecast = async (weatherData) => {
    const forecastList = weatherData.list.slice(0, 5); // Get first 5 forecasts (5 days)
    let weatherDescription = '';
    // Prepare the weather description for each day
    forecastList.forEach((day) => {
        const date = new Date(day.dt * 1000).toLocaleDateString(); // Convert from Unix timestamp
        const temp = day.main.temp; // Temperature in Kelvin
        const description = day.weather[0].description; // Weather description from API
        // Convert temp from Kelvin to Celsius
        const tempCelsius = (temp - 273.15).toFixed(1);
        weatherDescription += `On ${date}, we expect ${tempCelsius}°C with ${description}. `;
    });
    // Create a prompt to pass to the OpenAI API
    const prompt = `
    You are a sports announcer. Given the following weather forecast for 5 days: ${weatherDescription} 
    Announce the weather in an exciting sports commentary style. 
    Provide a detailed and enthusiastic forecast for each day.
  `;
    try {
        // Request to the OpenAI API to generate the announcer-style forecast
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', // Using the GPT-3.5 model for the chat-based API
            messages: [
                { role: 'system', content: 'You are a sports announcer.' },
                { role: 'user', content: prompt }
            ],
            max_tokens: 300,
            temperature: 0.8,
        });
        // Extract the generated text
        const forecastText = response.choices[0].message.content;
        return forecastText;
    }
    catch (error) {
        console.error("Error generating forecast:", error);
        throw new Error("Failed to generate weather forecast.");
    }
};
