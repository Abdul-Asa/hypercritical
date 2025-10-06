"use client";

import { useState, useEffect, useRef, useCallback, RefObject } from "react";
import { ScriptItem } from "@/lib/data";
import MonacoEditorInstance from "@monaco-editor/react";
import { Monaco } from "@monaco-editor/react";

export interface UseEditorReturn {
  currentLanguage: "Python" | "Matlab";
  currentCode: string;
  isDirty: boolean;
  isEditMode: boolean;
  canUndo: boolean;
  canRedo: boolean;
  editorRef: RefObject<typeof MonacoEditorInstance>;
  handleLanguageChange: (newLanguage: "Python" | "Matlab") => void;
  handleCodeChange: (value: string) => void;
  handleEditorMount: (
    editor: typeof MonacoEditorInstance,
    monaco: Monaco
  ) => void;
  toggleEditMode: () => void;
  handleSave: () => void;
  handleUndo: () => void;
  handleRedo: () => void;
}

export function useEditor(
  selectedScript: ScriptItem | null,
  onScriptUpdate: (scriptId: string, updates: Partial<ScriptItem>) => void
): UseEditorReturn {
  const [currentLanguage, setCurrentLanguage] = useState<"Python" | "Matlab">(
    selectedScript?.script_language || "Python"
  );
  const [currentCode, setCurrentCode] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const editorRef = useRef<any>(null);

  const originalCode = selectedScript
    ? currentLanguage === "Python"
      ? selectedScript.codePython
      : selectedScript.codeMatlab
    : "";

  const isDirty = currentCode !== originalCode;

  useEffect(() => {
    if (selectedScript) {
      setCurrentLanguage(selectedScript.script_language);
      const code =
        selectedScript.script_language === "Python"
          ? selectedScript.codePython
          : selectedScript.codeMatlab;
      setCurrentCode(code);
      setIsEditMode(false);
    } else {
      setCurrentCode("");
      setIsEditMode(false);
      setCurrentLanguage("Python");
    }
  }, [selectedScript]);

  useEffect(() => {
    if (selectedScript) {
      const code =
        currentLanguage === "Python"
          ? selectedScript.codePython
          : selectedScript.codeMatlab;
      setCurrentCode(code);
    } else {
      setCurrentCode("");
    }
  }, [currentLanguage, selectedScript]);

  const handleEditorMount = useCallback(
    (editor: any, monaco: any) => {
      editorRef.current = editor;

      const updateUndoRedoState = () => {
        const model = editor.getModel();
        if (model) {
          setCanUndo(model.canUndo());
          setCanRedo(model.canRedo());
        }
      };

      editor.onDidChangeModelContent(() => {
        updateUndoRedoState();
      });

      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        if (selectedScript && isDirty && isEditMode) {
          handleSave();
        }
      });

      updateUndoRedoState();
    },
    [selectedScript, onScriptUpdate, isDirty, isEditMode]
  );

  const handleCodeChange = useCallback((value: string) => {
    setCurrentCode(value);
  }, []);

  const handleLanguageChange = useCallback(
    (newLanguage: "Python" | "Matlab") => {
      if (isDirty && isEditMode) {
        handleSave();
      }
      if (selectedScript) {
        onScriptUpdate(selectedScript.scriptId, {
          script_language: newLanguage,
          lastModified: new Date().toISOString(),
        });
      }
      setCurrentLanguage(newLanguage);
    },
    [isDirty, isEditMode, selectedScript, onScriptUpdate]
  );

  const toggleEditMode = useCallback(() => {
    if (isEditMode && isDirty) {
      handleSave();
    }
    setIsEditMode(!isEditMode);
  }, [isEditMode, isDirty]);

  const handleSave = useCallback(() => {
    if (!selectedScript || !onScriptUpdate || !isDirty) return;

    const updates: Partial<ScriptItem> = {
      lastModified: new Date().toISOString(),
      noOfModification: selectedScript.noOfModification + 1,
    };

    if (currentLanguage === "Python") {
      updates.codePython = currentCode;
    } else {
      updates.codeMatlab = currentCode;
    }

    onScriptUpdate(selectedScript.scriptId, updates);
    setIsEditMode(false);
  }, [selectedScript, onScriptUpdate, isDirty, currentCode, currentLanguage]);

  const handleUndo = useCallback(() => {
    if (editorRef.current && canUndo) {
      editorRef.current.trigger("keyboard", "undo", null);
    }
  }, [canUndo]);

  const handleRedo = useCallback(() => {
    if (editorRef.current && canRedo) {
      editorRef.current.trigger("keyboard", "redo", null);
    }
  }, [canRedo]);

  return {
    currentLanguage,
    currentCode,
    isDirty,
    isEditMode,
    canUndo,
    canRedo,
    editorRef,
    handleLanguageChange,
    handleCodeChange,
    handleEditorMount,
    toggleEditMode,
    handleSave,
    handleUndo,
    handleRedo,
  };
}
