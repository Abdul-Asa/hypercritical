"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScriptItem } from "@/lib/data";
import { ConfirmationDialog } from "./confirmation-dialog";
import {
  Check,
  X,
  Sparkles,
  Trash2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface TestScriptSidebarProps {
  scripts: ScriptItem[];
  selectedScript: ScriptItem | null;
  onScriptSelect: (script: ScriptItem) => void;
  onScriptUpdate?: (scriptId: string, updates: Partial<ScriptItem>) => void;
  onScriptDelete?: (scriptId: string) => void;
}

export function TestScriptSidebar({
  scripts,
  selectedScript,
  onScriptSelect,
  onScriptUpdate,
  onScriptDelete,
}: TestScriptSidebarProps) {
  const [filterAccepted, setFilterAccepted] = useState(false);
  const [unitTestsCollapsed, setUnitTestsCollapsed] = useState(false);
  const [simulationTestsCollapsed, setSimulationTestsCollapsed] =
    useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    scriptId: string;
    scriptName: string;
  }>({
    isOpen: false,
    scriptId: "",
    scriptName: "",
  });

  const filteredScripts = filterAccepted
    ? scripts.filter((script) => script.isAccepted)
    : scripts;

  const unitTests = filteredScripts.filter(
    (script) => script.script_type === "unit_test"
  );
  const simulationTests = filteredScripts.filter(
    (script) => script.script_type === "simulation_test"
  );

  const getShortId = (scriptId: string) => {
    return scriptId.split("-")[0];
  };

  const handleAcceptToggle = (scriptId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onScriptUpdate) {
      const script = scripts.find((s) => s.scriptId === scriptId);
      if (script) {
        onScriptUpdate(scriptId, { isAccepted: !script.isAccepted });
      }
    }
  };

  const handleDelete = (scriptId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const script = scripts.find((s) => s.scriptId === scriptId);
    if (script) {
      setDeleteDialog({
        isOpen: true,
        scriptId,
        scriptName: script.testDescription,
      });
    }
  };

  const confirmDelete = () => {
    if (onScriptDelete && deleteDialog.scriptId) {
      onScriptDelete(deleteDialog.scriptId);
    }
    setDeleteDialog({ isOpen: false, scriptId: "", scriptName: "" });
  };

  const cancelDelete = () => {
    setDeleteDialog({ isOpen: false, scriptId: "", scriptName: "" });
  };

  const handleGenerate = (scriptId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement generate functionality
    console.log("Generate for script:", scriptId);
  };

  const ScriptButton = ({ script }: { script: ScriptItem }) => (
    <div
      onClick={() => onScriptSelect(script)}
      className={cn(
        "w-full p-3 transition-all duration-200 group cursor-pointer rounded-md border",
        selectedScript?.scriptId === script.scriptId
          ? "bg-primary/40 border-primary/70"
          : "hover:bg-primary/15 border-border/30"
      )}
    >
      <div className="flex flex-col space-y-2 w-full">
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-medium text-left flex-1">
            {script.testDescription}
          </span>
          <span className="text-xs font-mono text-muted-foreground group-hover:text-foreground ml-2">
            {getShortId(script.scriptId)}
          </span>
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => handleAcceptToggle(script.scriptId, e)}
              className={cn(
                "h-6 w-6 p-0 rounded",
                script.isAccepted
                  ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              {script.isAccepted ? (
                <Check className="h-3 w-3" />
              ) : (
                <X className="h-3 w-3" />
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => handleGenerate(script.scriptId, e)}
              className="h-6 w-6 p-0 rounded text-foreground "
            >
              <Sparkles className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => handleDelete(script.scriptId, e)}
              className="h-6 w-6 p-0 rounded text-red-400 hover:bg-red-500/20"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const acceptedCount = scripts.filter((script) => script.isAccepted).length;

  const handleGenerateAllAccepted = () => {
    const acceptedScripts = scripts.filter((script) => script.isAccepted);
    // TODO: Implement generate all accepted functionality
    console.log(
      "Generate all accepted scripts:",
      acceptedScripts.map((s) => s.scriptId)
    );
  };
  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Filter Header */}
      <Card>
        <div className="p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">
              Test Descriptions
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                Filter accepted
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilterAccepted(!filterAccepted)}
                className={cn(
                  "h-6 w-10 p-0 rounded-full transition-colors",
                  filterAccepted
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "h-4 w-4 rounded-full bg-white transition-transform",
                    filterAccepted ? "translate-x-2" : "-translate-x-2"
                  )}
                />
              </Button>
            </div>
          </div>
          <Button
            onClick={handleGenerateAllAccepted}
            disabled={acceptedCount === 0}
            variant="outline"
            className="w-full font-mono text-sm"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate All Accepted ({acceptedCount})
          </Button>
        </div>
      </Card>
      {/* Unit Tests Card */}
      <Card
        className={cn(
          "transition-all duration-200",
          unitTestsCollapsed ? "h-26" : "h-100"
        )}
      >
        <div className="p-4 flex flex-col h-full">
          <Button
            variant="ghost"
            onClick={() => setUnitTestsCollapsed(!unitTestsCollapsed)}
            className="flex items-center justify-between p-0 h-auto hover:bg-transparent flex-shrink-0"
          >
            <div className="flex items-center space-x-2">
              {unitTestsCollapsed ? (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
              <h3 className="text-lg font-bold text-foreground">UNIT TESTS</h3>
            </div>
            <Badge
              variant="outline"
              className="font-mono text-xs corner-accent"
            >
              {unitTests.length}
            </Badge>
          </Button>

          {!unitTestsCollapsed && (
            <div className="mt-4 flex-1 overflow-y-auto min-h-0">
              <div className="space-y-2">
                {unitTests.map((script) => (
                  <ScriptButton key={script.scriptId} script={script} />
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Simulation Tests Card */}
      <Card
        className={cn(
          "transition-all duration-200",
          simulationTestsCollapsed ? "h-26" : "h-100"
        )}
      >
        <div className="p-4 flex flex-col h-full">
          <Button
            variant="ghost"
            onClick={() =>
              setSimulationTestsCollapsed(!simulationTestsCollapsed)
            }
            className="flex items-center justify-between p-0 h-auto hover:bg-transparent flex-shrink-0"
          >
            <div className="flex items-center space-x-2">
              {simulationTestsCollapsed ? (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
              <h3 className="text-lg font-bold text-foreground">
                SIMULATION TESTS
              </h3>
            </div>
            <Badge
              variant="outline"
              className="font-mono text-xs corner-accent"
            >
              {simulationTests.length}
            </Badge>
          </Button>

          {!simulationTestsCollapsed && (
            <div className="mt-4 flex-1 overflow-y-auto min-h-0">
              <div className="space-y-2">
                {simulationTests.map((script) => (
                  <ScriptButton key={script.scriptId} script={script} />
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Test Script"
        description={`Are you sure you want to delete "${deleteDialog.scriptName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
