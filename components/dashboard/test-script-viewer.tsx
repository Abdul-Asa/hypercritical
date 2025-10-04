"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MonacoEditor } from "@/components/dashboard/monaco-editor";
import { AlertWithTrigger } from "@/components/dashboard/alert-with-trigger";
import { cn, getShortId } from "@/lib/utils";
import { useData } from "@/hooks/useData";
import { useEditor } from "@/hooks/useEditor";
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
  Save,
  Undo,
  Redo,
  Trash2,
  Edit3,
  Lock,
  Sparkles,
} from "lucide-react";

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

  const [isStatusExpanded, setIsStatusExpanded] = useState(false);

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

  return (
    <Card className="h-full flex flex-col">
      <div className="p-6 flex flex-col flex-1 space-y-4 min-h-screen">
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
              <span className="text-primary">TERMINAL</span>
              <span className="text-muted-foreground">
                View execution logs and output
              </span>
            </div>
          </Button>

          {isStatusExpanded && (
            <div className="mt-2 bg-black/90 rounded border border-border/20 text-xs font-mono overflow-hidden">
              {/* Terminal Content */}
              <div className="p-3 max-h-48 overflow-y-auto space-y-1">
                {/* Placeholder for future log implementation */}
                <div className="flex items-start space-x-2">
                  <span className="text-muted-foreground/70 text-xs shrink-0">
                    [00:00:00]
                  </span>
                  <span className="text-blue-400 text-xs">
                    Terminal ready for execution logs
                  </span>
                </div>

                {/* Terminal Cursor */}
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-green-400">$</span>
                  <div className="w-2 h-4 bg-green-400 animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
        </div>
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
                      <Button variant="outline" className="font-mono text-sm">
                        <Sparkles className="h-4 w-4 mr-2" />
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
