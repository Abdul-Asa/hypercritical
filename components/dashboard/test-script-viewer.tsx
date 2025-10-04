"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MonacoEditor } from "@/components/ui/monaco-editor";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { cn } from "@/lib/utils";
import { ScriptItem } from "@/lib/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Save,
  Undo,
  Redo,
  Trash2,
  Edit3,
  Lock,
} from "lucide-react";

interface TestScriptViewerProps {
  selectedScript: ScriptItem | null;
  onScriptUpdate?: (scriptId: string, updates: Partial<ScriptItem>) => void;
  onScriptDelete?: (scriptId: string) => void;
}

export function TestScriptViewer({
  selectedScript,
  onScriptUpdate,
  onScriptDelete,
}: TestScriptViewerProps) {
  const [currentLanguage, setCurrentLanguage] = useState<"Python" | "Matlab">(
    selectedScript?.script_language || "Python"
  );
  const [isStatusExpanded, setIsStatusExpanded] = useState(false);
  const [currentCode, setCurrentCode] = useState("");
  const [originalCode, setOriginalCode] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const editorRef = useRef<any>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Update code when script changes
  useEffect(() => {
    if (selectedScript) {
      setCurrentLanguage(selectedScript.script_language);
      const code =
        selectedScript.script_language === "Python"
          ? selectedScript.codePython
          : selectedScript.codeMatlab;
      setCurrentCode(code);
      setOriginalCode(code);
      setIsDirty(false);
      setIsEditMode(false); // Reset to locked mode when switching scripts
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
      setOriginalCode(code);
      setIsDirty(false);
    }
  }, [currentLanguage, selectedScript]);

  // Update dirty state when code changes
  useEffect(() => {
    setIsDirty(currentCode !== originalCode);
  }, [currentCode, originalCode]);

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
          setOriginalCode(currentCode);
          setIsDirty(false);
          setIsEditMode(false); // Lock after saving
        }
      });

      updateUndoRedoState();
    },
    [
      selectedScript,
      onScriptUpdate,
      isDirty,
      currentCode,
      currentLanguage,
      isEditMode,
    ]
  );

  // Handle code changes
  const handleCodeChange = useCallback((value: string) => {
    setCurrentCode(value);
  }, []);

  // Handle language change
  const handleLanguageChange = (newLanguage: "Python" | "Matlab") => {
    if (isDirty && isEditMode) {
      // Save current changes before switching if in edit mode
      handleSave();
    }
    setCurrentLanguage(newLanguage);
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditMode && isDirty) {
      // If exiting edit mode with unsaved changes, save them
      handleSave();
    }
    setIsEditMode(!isEditMode);
  };

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
    setOriginalCode(currentCode);
    setIsDirty(false);
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

  // Delete functionality
  const handleDelete = useCallback(() => {
    setShowDeleteDialog(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (selectedScript && onScriptDelete) {
      onScriptDelete(selectedScript.scriptId);
    }
  }, [selectedScript, onScriptDelete]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "unit_test":
        return "bg-green-500/10 text-green-400 border-green-500/30";
      case "simulation_test":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  const getShortId = (scriptId: string) => {
    return scriptId.split("-")[0];
  };

  if (!selectedScript) {
    return (
      <div className="h-full flex flex-col">
        <Card className="h-full flex flex-col">
          <div className="p-6 flex flex-col h-full items-center justify-center">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold text-muted-foreground">
                SELECT A TEST
              </h3>
              <p className="text-sm font-mono text-muted-foreground/70 max-w-md">
                Choose a unit test or simulation test from the sidebar to view
                its code and details.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Card className="h-full flex flex-col">
        <div className="p-6 flex flex-col h-full space-y-4">
          {/* Header with controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Select
                value={currentLanguage}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Python">Python</SelectItem>
                  <SelectItem value="Matlab">Matlab</SelectItem>
                </SelectContent>
              </Select>
              <Badge
                variant="outline"
                className={cn(
                  "font-mono text-xs",
                  getTypeColor(selectedScript.script_type)
                )}
              >
                {selectedScript.script_type.replace("_", " ").toUpperCase()}
              </Badge>
              {isEditMode && (
                <Badge
                  variant="outline"
                  className="font-mono text-xs text-blue-400 border-blue-400/30"
                >
                  EDIT MODE
                </Badge>
              )}
              {isDirty && isEditMode && (
                <Badge
                  variant="outline"
                  className="font-mono text-xs text-yellow-400 border-yellow-400/30"
                >
                  UNSAVED
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {/* Action buttons */}
              <div className="flex items-center space-x-1">
                {/* Edit/Lock Toggle */}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleEditMode}
                  className={cn(
                    "h-8 w-8 p-0",
                    isEditMode
                      ? "text-blue-400 hover:bg-blue-500/20"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                  title={isEditMode ? "Lock Editor" : "Edit Code"}
                >
                  {isEditMode ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <Edit3 className="h-4 w-4" />
                  )}
                </Button>

                {/* Edit Mode Actions */}
                {isEditMode && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleUndo}
                      disabled={!canUndo}
                      className="h-8 w-8 p-0"
                      title="Undo (Ctrl+Z)"
                    >
                      <Undo className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleRedo}
                      disabled={!canRedo}
                      className="h-8 w-8 p-0"
                      title="Redo (Ctrl+Y)"
                    >
                      <Redo className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleSave}
                      disabled={!isDirty}
                      className={cn(
                        "h-8 w-8 p-0",
                        isDirty && "text-green-400 hover:bg-green-500/20"
                      )}
                      title="Save (Ctrl+S)"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </>
                )}

                {/* Delete button - always available */}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDelete}
                  className="h-8 w-8 p-0 text-red-400 hover:bg-red-500/20"
                  title="Delete Script"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-xs font-mono text-muted-foreground">
                <span>ID: {getShortId(selectedScript.scriptId)}</span>
                <span className="mx-2">•</span>
                <span>Modified: {selectedScript.noOfModification}x</span>
              </div>
            </div>
          </div>

          {/* Expandable Status Bar */}
          <div className="flex-shrink-0">
            <Button
              variant="ghost"
              onClick={() => setIsStatusExpanded(!isStatusExpanded)}
              className="w-full justify-start items-center p-2 bg-muted/20 rounded border border-border/30 text-xs font-mono hover:bg-muted/30"
            >
              {isStatusExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
              <div className="flex items-center space-x-4">
                <span className="text-green-400">● LOADED</span>
                <span className="text-muted-foreground">
                  {selectedScript.script_type.replace("_", " ")} •{" "}
                  {currentLanguage}
                </span>
              </div>
            </Button>

            {isStatusExpanded && (
              <div className="mt-2 p-3 bg-muted/10 rounded border border-border/20 text-xs font-mono space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3 text-blue-400" />
                      <span className="text-muted-foreground">Created:</span>
                      <span className="text-foreground">
                        {new Date(
                          selectedScript.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-400" />
                      <span className="text-muted-foreground">Suite:</span>
                      <span className="text-foreground">
                        {selectedScript.isIncludedSuite
                          ? "Included"
                          : "Not included"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-3 w-3 text-yellow-400" />
                      <span className="text-muted-foreground">Status:</span>
                      <span
                        className={cn(
                          "font-medium",
                          selectedScript.isAccepted
                            ? "text-green-400"
                            : "text-yellow-400"
                        )}
                      >
                        {selectedScript.isAccepted
                          ? "Accepted"
                          : "Pending Review"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground">
                        Modifications:
                      </span>
                      <span className="text-foreground">
                        {selectedScript.noOfModification}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground">
                        Last Modified:
                      </span>
                      <span className="text-foreground">
                        {selectedScript.lastModified
                          ? new Date(
                              selectedScript.lastModified
                            ).toLocaleDateString()
                          : "Never"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground">Project ID:</span>
                      <span className="text-foreground font-mono text-xs">
                        {selectedScript.projectID.split("-")[0]}...
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/20">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Build Status:</span>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
                      <span className="text-green-400">Ready</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 bg-card border border-border/30 rounded tactical-grid relative overflow-hidden min-h-0">
            <MonacoEditor
              value={currentCode}
              language={currentLanguage.toLowerCase() as "python" | "matlab"}
              onChange={isEditMode ? handleCodeChange : undefined}
              onMount={handleEditorMount}
              readOnly={!isEditMode}
              className="h-full"
              height="100%"
            />
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Test Script"
        description={`Are you sure you want to delete "${selectedScript.testDescription}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </>
  );
}
