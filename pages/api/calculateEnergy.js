import OpenAI from "openai";
import { calculateEnergy } from "../../utils/energyCalculator";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { weatherData, solarPanelCharacteristics } = req.body;

    const sendMessages = [
      {
        "role": "system",
        "content": "You are an AI that calculates estimated energy production from solar panels based on weather data and solar panel characteristics."
      },
      {
        "role": "user",
        "content": `Given the following weather data and solar panel characteristics, generate an output array where each element contains the date, location, estimated energy production in kWh, and an AI insight. Weather Data: ${JSON.stringify(weatherData)}, Solar Panel Characteristics: ${JSON.stringify(solarPanelCharacteristics)}, The estimated energy production in kWh is calculated using the formula: ( sunlightHours * panelCapacity * (1 - cloudCoverPercentage / 100) * efficiency/100 ) * panelNum; Return only the output array without any formatting or code blocks. The format should be:
      [
        {
          "date": "YYYY-MM-DD", 
          "location": "City Name", 
          "estimated_energy_production_kWh": estimated_value, 
          "ai_insight": "On [date], with [sunlight_hours] hours of sunlight and [cloud_cover_percentage]% cloud cover, the solar panels produced [estimated_value] kWh. The weather conditions were [ideal/average/poor] for high energy production."
        }
      ]`
      }

    ]

    try {
      // Set headers to allow streaming
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
        'Transfer-Encoding': 'chunked',
      });


      // Stream OpenAI response
      const completion = await openai.chat.completions.create({
        messages: sendMessages,
        model: "gpt-4-turbo-preview",
        temperature: 0.3,
        top_p: 0.2,
        n: 1, 
        stream: true,
        presence_penalty: 0,
        frequency_penalty: 0,
      })

      for await (const part of completion) {
        // check to end the loop
        if (completion?.controller.signal.aborted) {
          res.end();
          break;
        }
        if (part.choices[0].finish_reason === "stop") {
          res.end();
          break;
        }
        res.write(part.choices[0]?.delta?.content || "");
        res.flush()
      }
      res.end()

    } catch (error) {
      console.error("Error streaming response:", error);
      res.status(500).json({ message: "Error streaming response", error });
    }
  } else {
    res.status(405).json({ message: "Only POST requests are allowed" });
  }
}