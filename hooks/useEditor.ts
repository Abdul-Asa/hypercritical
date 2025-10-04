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
  onScriptUpdate?: (scriptId: string, updates: Partial<ScriptItem>) => void
): UseEditorReturn {
  const [currentLanguage, setCurrentLanguage] = useState<"Python" | "Matlab">(
    selectedScript?.script_language || "Python"
  );
  const [currentCode, setCurrentCode] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const editorRef = useRef<any>(null);

  // Derive original code from the selected script and current language
  const originalCode = selectedScript
    ? currentLanguage === "Python"
      ? selectedScript.codePython
      : selectedScript.codeMatlab
    : "";

  // Derive isDirty from comparing current code with original
  const isDirty = currentCode !== originalCode;

  // Update code when script changes
  useEffect(() => {
    if (selectedScript) {
      setCurrentLanguage(selectedScript.script_language);
      const code =
        selectedScript.script_language === "Python"
          ? selectedScript.codePython
          : selectedScript.codeMatlab;
      setCurrentCode(code);
      setIsEditMode(false); // Reset to locked mode when switching scripts
    } else {
      // Reset editor state when no script is selected
      setCurrentCode("");
      setIsEditMode(false);
      setCurrentLanguage("Python"); // Default language
    }
  }, [selectedScript]);

  // Update code when language changes
  useEffect(() => {
    if (selectedScript) {
      const code =
        currentLanguage === "Python"
          ? selectedScript.codePython
          : selectedScript.codeMatlab;
      setCurrentCode(code);
    } else {
      // Clear code when no script is selected
      setCurrentCode("");
    }
  }, [currentLanguage, selectedScript]);

  // Handle editor mount and setup undo/redo tracking
  const handleEditorMount = useCallback(
    (editor: any, monaco: any) => {
      editorRef.current = editor;

      // Track undo/redo state
      const updateUndoRedoState = () => {
        const model = editor.getModel();
        if (model) {
          setCanUndo(model.canUndo());
          setCanRedo(model.canRedo());
        }
      };

      // Listen for model changes to update undo/redo state
      editor.onDidChangeModelContent(() => {
        updateUndoRedoState();
      });

      // Setup keyboard shortcuts
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        if (selectedScript && onScriptUpdate && isDirty && isEditMode) {
          handleSave();
        }
      });

      updateUndoRedoState();
    },
    [selectedScript, onScriptUpdate, isDirty, isEditMode]
  );

  // Handle code changes
  const handleCodeChange = useCallback((value: string) => {
    setCurrentCode(value);
  }, []);

  // Handle language change
  const handleLanguageChange = useCallback(
    (newLanguage: "Python" | "Matlab") => {
      if (isDirty && isEditMode) {
        // Save current changes before switching if in edit mode
        handleSave();
      }
      setCurrentLanguage(newLanguage);
    },
    [isDirty, isEditMode]
  );

  // Toggle edit mode
  const toggleEditMode = useCallback(() => {
    if (isEditMode && isDirty) {
      // If exiting edit mode with unsaved changes, save them
      handleSave();
    }
    setIsEditMode(!isEditMode);
  }, [isEditMode, isDirty]);

  // Save functionality
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
    setIsEditMode(false); // Lock the editor after saving
  }, [selectedScript, onScriptUpdate, isDirty, currentCode, currentLanguage]);

  // Undo functionality
  const handleUndo = useCallback(() => {
    if (editorRef.current && canUndo) {
      editorRef.current.trigger("keyboard", "undo", null);
    }
  }, [canUndo]);

  // Redo functionality
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
