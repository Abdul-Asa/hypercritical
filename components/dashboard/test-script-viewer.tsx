"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MonacoEditor } from "@/components/dashboard/monaco-editor";
import { AlertWithTrigger } from "@/components/dashboard/alert-with-trigger";
import { cn } from "@/lib/utils";
import { useData } from "@/hooks/use-data";
import { useEditor } from "@/hooks/use-editor";
import { useStream } from "@/hooks/use-stream";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Undo, Redo, Trash2, Edit3, Lock, Sparkles } from "lucide-react";

export function TestScriptViewer() {
  const { selectedScript, updateScript, deleteScript } = useData();
  const {
    currentLanguage,
    currentCode,
    isDirty,
    isEditMode,
    canUndo,
    canRedo,
    handleLanguageChange,
    handleCodeChange,
    handleEditorMount,
    toggleEditMode,
    handleSave,
    handleUndo,
    handleRedo,
  } = useEditor(selectedScript, updateScript);
  const { generateSingle, isStreaming } = useStream();

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

  const confirmDelete = () => {
    if (selectedScript) {
      deleteScript(selectedScript.scriptId);
    }
  };

  const handleGenerateCode = async () => {
    if (!selectedScript) return;

    await generateSingle(
      selectedScript,
      currentLanguage,
      handleCodeChange,
      updateScript
    );
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-6 flex flex-col flex-1 space-y-4 min-h-screen">
        {!selectedScript ? (
          <div className="flex-1 flex flex-col min-h-0">
            <Card className="flex-1 flex flex-col">
              <div className="p-6 flex flex-col flex-1 items-center justify-center min-h-0">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold text-muted-foreground">
                    SELECT A TEST
                  </h3>
                  <p className="text-sm font-mono text-muted-foreground/70 max-w-md">
                    Choose a unit test or simulation test from the sidebar to
                    view its code and details.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <>
            <div className="@container">
              <div className="flex flex-col @lg:flex-row @lg:items-center @lg:justify-between gap-3 @lg:gap-0">
                <div className="flex flex-col @md:flex-row @md:items-center gap-2 @md:gap-3">
                  <div className="text-sm font-medium text-foreground max-w-[200px] @md:max-w-[300px] truncate">
                    {selectedScript.testDescription}
                  </div>
                  <div className="flex items-center gap-2">
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
                        "font-mono text-xs whitespace-nowrap",
                        getTypeColor(selectedScript.script_type)
                      )}
                    >
                      {selectedScript.script_type
                        .replace("_", " ")
                        .toUpperCase()}
                    </Badge>
                    {isStreaming && (
                      <Badge
                        variant="outline"
                        className="font-mono text-xs whitespace-nowrap"
                      >
                        GENERATING
                        <span className="relative ml-auto flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-green-400"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                        </span>
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between @lg:justify-end gap-2">
                  <div className="flex items-center gap-2">
                    {isEditMode ? (
                      <Badge
                        variant="outline"
                        className="font-mono text-xs text-blue-400 border-blue-400/30 whitespace-nowrap"
                      >
                        EDIT MODE
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="font-mono text-xs text-muted-foreground border-muted-foreground/30 whitespace-nowrap"
                      >
                        READ ONLY
                      </Badge>
                    )}
                    {isDirty && isEditMode && (
                      <Badge
                        variant="outline"
                        className="font-mono text-xs text-yellow-400 border-yellow-400/30 whitespace-nowrap"
                      >
                        UNSAVED
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
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
                      disabled={isStreaming}
                    >
                      {isEditMode ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        <Edit3 className="h-4 w-4" />
                      )}
                    </Button>

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

                    <AlertWithTrigger
                      trigger={
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-400 hover:bg-red-500/20"
                          title="Delete Script"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      }
                      title="Delete Test Script"
                      description={`Are you sure you want to delete "${selectedScript?.testDescription}"? This action cannot be undone.`}
                      confirmText="Delete"
                      cancelText="Cancel"
                      variant="destructive"
                      onConfirm={confirmDelete}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-card border border-border/30 rounded tactical-grid relative overflow-hidden min-h-0">
              {!(currentLanguage === "Python"
                ? selectedScript.isGeneratedPython
                : selectedScript.isGeneratedMatlab) ? (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-muted-foreground">
                      CODE NOT GENERATED
                    </h3>
                    <p className="text-sm font-mono text-muted-foreground/70 max-w-md">
                      This test doesn't have any generated code yet.
                    </p>
                    <div className="pt-4">
                      <Button
                        variant="outline"
                        className="font-mono text-sm"
                        onClick={handleGenerateCode}
                      >
                        <Sparkles className={cn("h-4 w-4 mr-2")} />
                        Generate {currentLanguage} Code
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <MonacoEditor
                  value={currentCode}
                  language={
                    currentLanguage.toLowerCase() as "python" | "matlab"
                  }
                  onChange={isEditMode ? handleCodeChange : undefined}
                  onMount={handleEditorMount}
                  readOnly={!isEditMode}
                  className="h-full"
                  height="100%"
                />
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
