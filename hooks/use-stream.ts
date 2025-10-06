"use client";

import { useState, useCallback } from "react";
import { ScriptItem } from "@/lib/data";
import { streamCodeGeneration, StreamOptions } from "@/lib/streaming";

export interface UseStreamReturn {
  isStreaming: boolean;
  generateSingle: (
    script: ScriptItem,
    language: "Python" | "Matlab",
    onCodeUpdate: (code: string) => void,
    onScriptUpdate: (scriptId: string, updates: Partial<ScriptItem>) => void
  ) => Promise<void>;
}

export function useStream(): UseStreamReturn {
  const [isStreaming, setIsStreaming] = useState(false);

  const generateSingle = useCallback(
    async (
      script: ScriptItem,
      language: "Python" | "Matlab",
      onCodeUpdate: (code: string) => void,
      onScriptUpdate: (scriptId: string, updates: Partial<ScriptItem>) => void
    ) => {
      if (isStreaming) return;

      setIsStreaming(true);

      const immediateUpdates: Partial<ScriptItem> = {};
      if (language === "Python") {
        immediateUpdates.isGeneratedPython = true;
      } else {
        immediateUpdates.isGeneratedMatlab = true;
      }
      onScriptUpdate(script.scriptId, immediateUpdates);

      let accumulatedCode = "";

      const streamOptions: StreamOptions = {
        testDescription: script.testDescription,
        language,
        testType: script.script_type,
        scriptId: script.scriptId,
      };

      try {
        await streamCodeGeneration(
          streamOptions,
          (chunk: string) => {
            accumulatedCode += chunk;
            const cleanedCode = cleanCodeBlock(accumulatedCode);
            onCodeUpdate(cleanedCode);
          },
          () => {
            const cleanedCode = cleanCodeBlock(accumulatedCode);
            const updates: Partial<ScriptItem> = {
              lastModified: new Date().toISOString(),
              noOfModification: script.noOfModification + 1,
            };

            if (language === "Python") {
              updates.codePython = cleanedCode;
              updates.isGeneratedPython = true;
            } else {
              updates.codeMatlab = cleanedCode;
              updates.isGeneratedMatlab = true;
            }

            onScriptUpdate(script.scriptId, updates);
            setIsStreaming(false);
          },
          (error: Error) => {
            console.error("Streaming error:", error);
            setIsStreaming(false);
          }
        );
      } catch (error) {
        console.error("Generate single error:", error);
        setIsStreaming(false);
      }
    },
    [isStreaming]
  );

  return {
    isStreaming,
    generateSingle,
  };
}
