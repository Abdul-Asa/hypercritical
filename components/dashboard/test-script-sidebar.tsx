"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";
import {
  filteredUnitTestsAtom,
  filteredSimulationTestsAtom,
} from "@/lib/atoms";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ScriptButton } from "@/components/dashboard/test-script-button";
export function TestScriptSidebar() {
  const filteredUnitTests = useAtomValue(filteredUnitTestsAtom);
  const filteredSimTests = useAtomValue(filteredSimulationTestsAtom);

  const [filterAccepted, setFilterAccepted] = useState(false);
  const [unitTestsCollapsed, setUnitTestsCollapsed] = useState(false);
  const [simulationTestsCollapsed, setSimulationTestsCollapsed] =
    useState(false);

  const unitTests = filteredUnitTests(filterAccepted);
  const simulationTests = filteredSimTests(filterAccepted);

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
                  <ScriptButton key={script.scriptId} script={script} />
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
                  <ScriptButton key={script.scriptId} script={script} />
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
