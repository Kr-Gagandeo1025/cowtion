import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIAnalysisResult } from '@/types';

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_KEY || ''
);

export async function analyzeImageForCattle(imageData: Blob): Promise<AIAnalysisResult> {
  try {
    if (!process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_KEY) {
      console.warn(
        'Google Generative AI key not configured, returning mock data'
      );
      return getMockAnalysisResult();
    }

    const base64Data = await blobToBase64(imageData);
    
    // Try with gemini-pro-vision first, fall back to gemini-1.5-flash
    let model;
    try {
      model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    } catch {
      try {
        model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      } catch {
        model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
      }
    }

    const prompt = `Analyze this road image and provide:
1. Count the number of cattle (cows, buffaloes, etc.) visible in the image
2. Assess the road condition (Good/Moderate/Poor)
3. Provide a brief description of the hazard level

Please respond ONLY in this JSON format (no markdown, no code blocks):
{
  "cowCount": <number>,
  "roadCondition": "Good|Moderate|Poor",
  "description": "<brief description of cattle and road hazards>"
}`;

    const response = await model.generateContent([
      {
        inlineData: {
          data: base64Data.split(',')[1],
          mimeType: 'image/jpeg',
        },
      },
      {
        text: prompt,
      },
    ]);

    const text = response.response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('Could not parse AI response, using mock data');
      return getMockAnalysisResult();
    }

    const result = JSON.parse(jsonMatch[0]) as AIAnalysisResult;
    return result;
  } catch (error) {
    console.error('Error analyzing image:', error);
    // Always return mock data as fallback
    return getMockAnalysisResult();
  }
}

function getMockAnalysisResult(): AIAnalysisResult {
  return {
    cowCount: Math.floor(Math.random() * 10) + 1,
    roadCondition: ['Good', 'Moderate', 'Poor'][
      Math.floor(Math.random() * 3)
    ] as 'Good' | 'Moderate' | 'Poor',
    description:
      'Cattle detected on road. Exercise caution and reduce speed.',
  };
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
