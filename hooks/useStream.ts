"use client";

import { useState, useCallback } from "react";
import {
  streamGeneration,
  cleanGeneratedCode,
  createTerminalLog,
  addTerminalLog,
  TerminalLog,
} from "@/lib/streaming";
import { ScriptItem } from "@/lib/data";

export interface UseStreamReturn {
  terminalLogs: TerminalLog[];
  isGenerating: boolean;
  generatingScripts: Set<string>;
  setTerminalLogs: React.Dispatch<React.SetStateAction<TerminalLog[]>>;
  setIsGenerating: (generating: boolean) => void;
  setGeneratingScripts: React.Dispatch<React.SetStateAction<Set<string>>>;
  addLog: (type: TerminalLog["type"], message: string) => void;
  initializeLogsForScript: (script: ScriptItem) => void;
  handleGenerateCode: (
    script: ScriptItem,
    language: "Python" | "Matlab",
    onScriptUpdate?: (scriptId: string, updates: Partial<ScriptItem>) => void,
    onCodeUpdate?: (code: string) => void
  ) => Promise<void>;
  handleGenerateScript: (
    script: ScriptItem,
    onScriptUpdate?: (scriptId: string, updates: Partial<ScriptItem>) => void
  ) => Promise<void>;
  handleGenerateAllAccepted: (
    scripts: ScriptItem[],
    onScriptUpdate?: (scriptId: string, updates: Partial<ScriptItem>) => void
  ) => Promise<void>;
}

export function useStream(): UseStreamReturn {
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingScripts, setGeneratingScripts] = useState<Set<string>>(
    new Set()
  );

  const addLog = useCallback((type: TerminalLog["type"], message: string) => {
    setTerminalLogs((prev) =>
      addTerminalLog(prev, createTerminalLog(type, message))
    );
  }, []);

  const initializeLogsForScript = useCallback((script: ScriptItem) => {
    const code =
      script.script_language === "Python"
        ? script.codePython
        : script.codeMatlab;

    setTerminalLogs([
      createTerminalLog("info", `Loaded test: ${script.testDescription}`),
      createTerminalLog(
        code.trim() ? "success" : "warning",
        code.trim() ? "Code loaded successfully" : "No code generated yet"
      ),
    ]);
  }, []);

  const handleGenerateCode = useCallback(
    async (
      script: ScriptItem,
      language: "Python" | "Matlab",
      onScriptUpdate?: (scriptId: string, updates: Partial<ScriptItem>) => void,
      onCodeUpdate?: (code: string) => void
    ) => {
      if (isGenerating) return;

      setIsGenerating(true);
      addLog("info", "Starting code generation...");

      try {
        let generatedCode = "";

        await streamGeneration(
          script.scriptId,
          script.testDescription,
          language,
          script.script_type,
          {
            onStart: () => {
              addLog("info", `Generating ${language} code...`);
            },
            onProgress: (chunk, fullText) => {
              generatedCode = fullText;
              onCodeUpdate?.(fullText);
              addLog("info", "Code generating...");
            },
            onComplete: (fullText) => {
              // Clean the generated code
              const cleanedCode = cleanGeneratedCode(fullText);
              generatedCode = cleanedCode;
              onCodeUpdate?.(cleanedCode);
              addLog("success", "Code generation completed successfully!");

              // Auto-save the generated code
              if (onScriptUpdate) {
                const updates: Partial<ScriptItem> = {
                  lastModified: new Date().toISOString(),
                  noOfModification: script.noOfModification + 1,
                };

                if (language === "Python") {
                  updates.codePython = cleanedCode;
                } else {
                  updates.codeMatlab = cleanedCode;
                }

                onScriptUpdate(script.scriptId, updates);
                addLog("success", "Code saved automatically");
              }
            },
            onError: (error) => {
              addLog("error", `Generation failed: ${error.message}`);
            },
          }
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        addLog("error", `Generation failed: ${errorMessage}`);
      } finally {
        setIsGenerating(false);
      }
    },
    [isGenerating, addLog]
  );

  const handleGenerateScript = useCallback(
    async (
      script: ScriptItem,
      onScriptUpdate?: (scriptId: string, updates: Partial<ScriptItem>) => void
    ) => {
      if (generatingScripts.has(script.scriptId)) return;

      setGeneratingScripts((prev) => new Set(prev).add(script.scriptId));

      try {
        await streamGeneration(
          script.scriptId,
          script.testDescription,
          script.script_language,
          script.script_type,
          {
            onComplete: (fullText) => {
              if (onScriptUpdate) {
                const cleanedCode = cleanGeneratedCode(fullText);
                const updates: Partial<ScriptItem> = {
                  lastModified: new Date().toISOString(),
                  noOfModification: script.noOfModification + 1,
                };

                if (script.script_language === "Python") {
                  updates.codePython = cleanedCode;
                } else {
                  updates.codeMatlab = cleanedCode;
                }

                onScriptUpdate(script.scriptId, updates);
              }
            },
            onError: (error) => {
              console.error("Generation failed:", error);
            },
          }
        );
      } catch (error) {
        console.error("Generation failed:", error);
      } finally {
        setGeneratingScripts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(script.scriptId);
          return newSet;
        });
      }
    },
    [generatingScripts]
  );

  const handleGenerateAllAccepted = useCallback(
    async (
      scripts: ScriptItem[],
      onScriptUpdate?: (scriptId: string, updates: Partial<ScriptItem>) => void
    ) => {
      const acceptedScripts = scripts.filter((script) => script.isAccepted);

      // Generate all accepted scripts in parallel
      const generatePromises = acceptedScripts.map(async (script) => {
        if (generatingScripts.has(script.scriptId)) return;

        setGeneratingScripts((prev) => new Set(prev).add(script.scriptId));

        try {
          await streamGeneration(
            script.scriptId,
            script.testDescription,
            script.script_language,
            script.script_type,
            {
              onComplete: (fullText) => {
                if (onScriptUpdate) {
                  const cleanedCode = cleanGeneratedCode(fullText);
                  const updates: Partial<ScriptItem> = {
                    lastModified: new Date().toISOString(),
                    noOfModification: script.noOfModification + 1,
                  };

                  if (script.script_language === "Python") {
                    updates.codePython = cleanedCode;
                  } else {
                    updates.codeMatlab = cleanedCode;
                  }

                  onScriptUpdate(script.scriptId, updates);
                }
              },
              onError: (error) => {
                console.error(
                  `Generation failed for ${script.scriptId}:`,
                  error
                );
              },
            }
          );
        } catch (error) {
          console.error(`Generation failed for ${script.scriptId}:`, error);
        } finally {
          setGeneratingScripts((prev) => {
            const newSet = new Set(prev);
            newSet.delete(script.scriptId);
            return newSet;
          });
        }
      });

      await Promise.all(generatePromises);
    },
    [generatingScripts]
  );

  return {
    terminalLogs,
    isGenerating,
    generatingScripts,
    setTerminalLogs,
    setIsGenerating,
    setGeneratingScripts,
    addLog,
    initializeLogsForScript,
    handleGenerateCode,
    handleGenerateScript,
    handleGenerateAllAccepted,
  };
}
