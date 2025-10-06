import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const runtime = "edge";

interface GenerateRequest {
  testDescription: string;
  language: "Python" | "Matlab";
  testType: "unit_test" | "simulation_test";
  scriptId: string;
}

export async function POST(req: Request) {
  try {
    const { testDescription, language, testType, scriptId }: GenerateRequest =
      await req.json();

    if (!testDescription || !language || !testType || !scriptId) {
      return new Response("Missing required fields", { status: 400 });
    }

    const systemPrompt = `You are Hyperpilot^, the world's most advanced control software engineering AI. You specialize in generating 100% accurate, production-ready control software for safety-critical applications in automotive, aerospace, and defense industries.

Your expertise includes:
- Control systems theory and implementation
- Safety-critical software development
- Real-time systems and embedded control
- Signal processing and filtering
- PID controllers, state-space models, and advanced control algorithms
- Sensor fusion and calibration
- System identification and parameter estimation
- Fault detection and diagnosis
- Hardware-in-the-loop (HIL) testing
- Model-based design and verification

You generate code that is:
- 100% accurate and production-ready
- Follows industry best practices for safety-critical systems
- Includes proper error handling and boundary conditions
- Uses appropriate numerical methods and algorithms
- Includes comprehensive comments explaining the control theory
- Optimized for real-time performance when applicable

Generate ${language} code for the following ${testType.replace("_", " ")}:`;

    const userPrompt = `Test Description: ${testDescription}

Generate ONLY the ${language} code for this ${testType.replace("_", " ")}. 

Requirements:
- Return ONLY executable code, no explanations or descriptions
- Include necessary imports and dependencies
- Add brief inline comments for clarity
- Follow ${language === "Python" ? "PEP 8" : "MATLAB"} coding standards
- For unit tests: Include test functions and assertions only
- For simulation tests: Include core simulation logic only
- NO main blocks (if __name__ == '__main__':)
- NO explanatory text before or after the code
- NO markdown formatting

Return pure, executable ${language} code only.`;

    const result = streamText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.1,
    });

    return result.toTextStreamResponse({
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error generating script:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
