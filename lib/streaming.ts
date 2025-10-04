export interface StreamingOptions {
  onStart?: () => void;
  onProgress?: (chunk: string, fullText: string) => void;
  onComplete?: (fullText: string) => void;
  onError?: (error: Error) => void;
}

export async function streamGeneration(
  scriptId: string,
  testDescription: string,
  language: "Python" | "Matlab",
  testType: "unit_test" | "simulation_test",
  options: StreamingOptions = {}
): Promise<string> {
  const { onStart, onProgress, onComplete, onError } = options;

  try {
    onStart?.();

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scriptId,
        testDescription,
        language,
        testType,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body reader available");
    }

    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      const chunk = decoder.decode(value, { stream: true });

      // Handle text stream - just append the chunk directly
      if (chunk) {
        fullText += chunk;
        onProgress?.(chunk, fullText);
      }
    }

    onComplete?.(fullText);
    return fullText;
  } catch (error) {
    const err =
      error instanceof Error ? error : new Error("Unknown error occurred");
    onError?.(err);
    throw err;
  }
}

export interface TerminalLog {
  timestamp: string;
  type: "info" | "success" | "warning" | "error";
  message: string;
}

export function createTerminalLog(
  type: TerminalLog["type"],
  message: string
): TerminalLog {
  return {
    timestamp: new Date().toLocaleTimeString(),
    type,
    message,
  };
}

export function addTerminalLog(
  logs: TerminalLog[],
  log: TerminalLog,
  maxLogs: number = 50
): TerminalLog[] {
  const newLogs = [...logs, log];
  return newLogs.slice(-maxLogs); // Keep only the last maxLogs entries
}

export function cleanGeneratedCode(code: string): string {
  // Remove markdown code blocks
  let cleaned = code.replace(/```[\w]*\n?/g, "");

  // Remove main blocks for Python
  cleaned = cleaned.replace(
    /\n*if __name__ == ['"]__main__['"]:\s*\n[\s\S]*$/m,
    ""
  );

  cleaned = cleaned.trim();

  return cleaned;
}
