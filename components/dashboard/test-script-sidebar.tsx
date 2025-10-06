"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, getShortId } from "@/lib/utils";
import { ScriptItem } from "@/lib/data";
import { useData } from "@/hooks/use-data";
import { Check, X, ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { AlertWithTrigger } from "./alert-with-trigger";

export function TestScriptSidebar() {
  const {
    updateScript,
    getUnitTests,
    getSimTests,
    selectScript,
    selectedScript,
  } = useData();

  const [filterAccepted, setFilterAccepted] = useState(false);
  const [unitTestsCollapsed, setUnitTestsCollapsed] = useState(false);
  const [simulationTestsCollapsed, setSimulationTestsCollapsed] =
    useState(false);

  const unitTests = getUnitTests(filterAccepted);
  const simulationTests = getSimTests(filterAccepted);

  return (
    <div className="h-full flex flex-col space-y-4">
      <Card>
        <div className="p-4 @container">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col @sm:flex-row @sm:items-center @sm:justify-between gap-2">
              <h2 className="text-lg font-bold text-foreground">
                Test Descriptions
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
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
          </div>
        </div>
      </Card>
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
                  <ScriptButton
                    key={script.scriptId}
                    script={script}
                    selectedScript={selectedScript}
                    selectScript={selectScript}
                    updateScript={updateScript}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

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
                  <ScriptButton
                    key={script.scriptId}
                    script={script}
                    selectedScript={selectedScript}
                    selectScript={selectScript}
                    updateScript={updateScript}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

interface ScriptButtonProps {
  script: ScriptItem;
  selectedScript: ScriptItem | null;
  selectScript: (script: ScriptItem) => void;
  updateScript: (scriptId: string, updates: Partial<ScriptItem>) => void;
}

const ScriptButton = ({
  script,
  selectedScript,
  selectScript,
  updateScript,
}: ScriptButtonProps) => {
  const { deleteScript } = useData();

  const handleAcceptToggle = (scriptId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateScript(scriptId, { isAccepted: !script.isAccepted });
  };

  const confirmDelete = () => {
    deleteScript(script.scriptId);
  };

  return (
    <div
      onClick={() => {
        selectScript(script);
      }}
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
              description={`Are you sure you want to delete "${script.testDescription}"? This action cannot be undone.`}
              confirmText="Delete"
              cancelText="Cancel"
              variant="destructive"
              onConfirm={confirmDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
