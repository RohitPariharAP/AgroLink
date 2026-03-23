// server/controllers/scanner.controller.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the AI with your secure key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeCrop = async (req, res) => {
  try {
    // 1. Check if an image was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image of the crop.' });
    }

    // 2. Convert the memory buffer into the format Gemini requires
    const imagePart = {
      inlineData: {
        data: req.file.buffer.toString('base64'),
        mimeType: req.file.mimetype
      },
    };

    // 3. Set up the AI model (gemini-1.5-flash is extremely fast for images)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // 4. Give the AI a very specific instruction (Prompt Engineering)
    const prompt = `
      You are an expert agricultural botanist. Analyze this image of a plant/crop.
      Please provide a structured response with the following information:
      1. Crop Name: (What plant is this?)
      2. Status: (Healthy, or Name of the Disease/Pest)
      3. Confidence: (High, Medium, or Low)
      4. Treatment/Advice: (Provide 2-3 short, actionable steps for the farmer to treat this issue or maintain health. Keep it simple and practical.)
      
      Keep the total response under 150 words.
    `;

    // 5. Send the image and prompt to the AI
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const aiText = response.text();

    // 6. Send the AI's analysis back to the React frontend
    res.json({ analysis: aiText });

  } catch (error) {
    console.error('🔥 AI SCANNER ERROR:', error);
    res.status(500).json({ message: 'Failed to analyze image', error: error.message });
  }
};

module.exports = { analyzeCrop };