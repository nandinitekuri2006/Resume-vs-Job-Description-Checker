
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AnalysisResult, InputData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const analyzeResumeMatch = async (
  resume: InputData,
  jobDescription: InputData
): Promise<AnalysisResult> => {
  const model = "gemini-3-flash-preview";

  const prompt = `
    Task: Act as an expert Technical Recruiter. Compare the provided Resume and Job Description (JD).
    
    1. Calculate a match percentage (0-100) based on skills, experience, and requirements.
    2. Provide a concise summary of the candidate's fit.
    3. Identify matching skills found in both documents.
    4. Identify missing skills that are required in the JD but not found in the Resume.
    5. Give 3-5 specific, actionable improvement tips to help the candidate tailor their resume for this specific role.
    6. Detect the job title from the Job Description.

    Format the response as a JSON object with the following structure:
    {
      "matchPercentage": number,
      "summary": string,
      "matchingSkills": string[],
      "missingSkills": string[],
      "improvementTips": string[],
      "jobTitleDetected": string
    }

    The input for Resume and Job Description might be text or an image. 
    Analyze the contents carefully.
  `;

  const contents: any[] = [{ text: prompt }];

  // Helper to construct parts for Gemini
  const preparePart = (label: string, data: InputData) => {
    const parts: any[] = [{ text: `--- ${label} ---` }];
    if (data.text) parts.push({ text: data.text });
    if (data.image) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: data.image.split(",")[1], // Remove prefix
        },
      });
    }
    return parts;
  };

  const resumeParts = preparePart("RESUME", resume);
  const jdParts = preparePart("JOB DESCRIPTION", jobDescription);

  const response: GenerateContentResponse = await ai.models.generateContent({
    model,
    contents: {
      parts: [...contents, ...resumeParts, ...jdParts]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          matchPercentage: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          matchingSkills: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          missingSkills: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          improvementTips: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          jobTitleDetected: { type: Type.STRING },
        },
        required: ["matchPercentage", "summary", "matchingSkills", "missingSkills", "improvementTips", "jobTitleDetected"]
      }
    }
  });

  const resultText = response.text;
  if (!resultText) throw new Error("No response from AI");
  
  return JSON.parse(resultText) as AnalysisResult;
};
