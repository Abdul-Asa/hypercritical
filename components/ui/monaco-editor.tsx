"use client";

import { useRef, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface MonacoEditorProps {
  value: string;
  language: "python" | "matlab";
  onChange?: (value: string) => void;
  onMount?: (editor: any, monaco: any) => void;
  readOnly?: boolean;
  className?: string;
  height?: string;
}

export function MonacoEditor({
  value,
  language,
  onChange,
  onMount,
  readOnly = false,
  className,
  height = "100%",
}: MonacoEditorProps) {
  const { theme } = useTheme();
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    setIsLoading(false);

    // Configure Monaco themes
    monaco.editor.defineTheme("tactical-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6B7280", fontStyle: "italic" },
        { token: "keyword", foreground: "8B5CF6" },
        { token: "string", foreground: "10B981" },
        { token: "number", foreground: "F59E0B" },
        { token: "operator", foreground: "EF4444" },
        { token: "function", foreground: "3B82F6" },
        { token: "variable", foreground: "E5E7EB" },
      ],
      colors: {
        "editor.background": "#0F172A",
        "editor.foreground": "#E2E8F0",
        "editor.lineHighlightBackground": "#1E293B",
        "editor.selectionBackground": "#374151",
        "editor.inactiveSelectionBackground": "#1F2937",
        "editorLineNumber.foreground": "#64748B",
        "editorLineNumber.activeForeground": "#94A3B8",
        "editorCursor.foreground": "#F8FAFC",
        "editor.findMatchBackground": "#7C3AED",
        "editor.findMatchHighlightBackground": "#5B21B6",
        "editorWidget.background": "#1E293B",
        "editorWidget.border": "#374151",
        "editorSuggestWidget.background": "#1E293B",
        "editorSuggestWidget.border": "#374151",
        "editorSuggestWidget.selectedBackground": "#374151",
      },
    });

    monaco.editor.defineTheme("tactical-light", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6B7280", fontStyle: "italic" },
        { token: "keyword", foreground: "7C3AED" },
        { token: "string", foreground: "059669" },
        { token: "number", foreground: "D97706" },
        { token: "operator", foreground: "DC2626" },
        { token: "function", foreground: "2563EB" },
        { token: "variable", foreground: "374151" },
      ],
      colors: {
        "editor.background": "#FFFFFF",
        "editor.foreground": "#374151",
        "editor.lineHighlightBackground": "#F8FAFC",
        "editor.selectionBackground": "#E0E7FF",
        "editor.inactiveSelectionBackground": "#F1F5F9",
        "editorLineNumber.foreground": "#94A3B8",
        "editorLineNumber.activeForeground": "#64748B",
        "editorCursor.foreground": "#1E293B",
        "editor.findMatchBackground": "#A78BFA",
        "editor.findMatchHighlightBackground": "#C4B5FD",
        "editorWidget.background": "#F8FAFC",
        "editorWidget.border": "#E2E8F0",
        "editorSuggestWidget.background": "#FFFFFF",
        "editorSuggestWidget.border": "#E2E8F0",
        "editorSuggestWidget.selectedBackground": "#F1F5F9",
      },
    });

    // Set initial theme
    const initialTheme = theme === "dark" ? "tactical-dark" : "tactical-light";
    monaco.editor.setTheme(initialTheme);

    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
      lineHeight: 1.6,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: "on",
      lineNumbers: "on",
      glyphMargin: false,
      folding: true,
      lineDecorationsWidth: 0,
      lineNumbersMinChars: 3,
      renderLineHighlight: "line",
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly,
      cursorStyle: "line",
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      detectIndentation: false,
    });

    // Call the onMount callback if provided
    if (onMount) {
      onMount(editor, monaco);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (onChange && value !== undefined) {
      onChange(value);
    }
  };

  // Map language names to Monaco language identifiers
  const getMonacoLanguage = (lang: "python" | "matlab") => {
    switch (lang) {
      case "python":
        return "python";
      case "matlab":
        // Python is the closest syntax match for MATLAB
        // Both support: mathematical operations, array indexing, function calls
        // MATLAB: plot(x, y); title('Graph');
        // Python:  plot(x, y); title('Graph')
        return "python";
      default:
        return "plaintext";
    }
  };

  // Handle theme changes
  useEffect(() => {
    if (monacoRef.current && editorRef.current) {
      const monacoTheme = theme === "dark" ? "tactical-dark" : "tactical-light";
      monacoRef.current.editor.setTheme(monacoTheme);
    }
  }, [theme]);

  return (
    <div className={cn("relative", className)}>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-card">
          <div className="text-muted-foreground font-mono text-sm">
            Loading editor...
          </div>
        </div>
      )}
      <Editor
        height={height}
        language={getMonacoLanguage(language)}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme={theme === "dark" ? "tactical-dark" : "tactical-light"}
        loading={
          <div className="flex items-center justify-center h-full bg-card">
            <div className="text-muted-foreground font-mono text-sm">
              Initializing...
            </div>
          </div>
        }
        options={{
          readOnly,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
