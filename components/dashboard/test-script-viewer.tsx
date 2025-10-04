"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

interface TestScriptViewerProps {
  selectedScript: ScriptItem | null;
}

export function TestScriptViewer({ selectedScript }: TestScriptViewerProps) {
  const [currentLanguage, setCurrentLanguage] = useState<"Python" | "Matlab">(
    selectedScript?.script_language || "Python"
  );
  const [isStatusExpanded, setIsStatusExpanded] = useState(false);

  useEffect(() => {
    if (selectedScript) {
      setCurrentLanguage(selectedScript.script_language);
    }
  }, [selectedScript]);

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

  const formatCode = (code: string) => {
    return code.split("\n").map((line, index) => (
      <div key={index} className="flex items-start space-x-4">
        <div className="text-muted-foreground/50 text-right w-8 select-none font-mono text-xs">
          {index + 1}
        </div>
        <div className="flex-1 font-mono text-sm text-foreground whitespace-pre-wrap">
          {line}
        </div>
      </div>
    ));
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

  const code =
    currentLanguage === "Python"
      ? selectedScript.codePython
      : selectedScript.codeMatlab;

  return (
    <Card className="h-full flex flex-col">
      <div className="p-6 flex flex-col h-full space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Select
              value={currentLanguage}
              onValueChange={(value: "Python" | "Matlab") =>
                setCurrentLanguage(value)
              }
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
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-muted-foreground">
            <span>ID: {getShortId(selectedScript.scriptId)}</span>
            <span>•</span>
            <span>Modified: {selectedScript.noOfModification}x</span>
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
                      {new Date(selectedScript.createdAt).toLocaleDateString()}
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

        {/* Code Display */}
        <div className="flex-1 bg-card border border-border/30 rounded tactical-grid relative overflow-hidden min-h-0">
          {/* Code Content Area */}
          <div className="p-4 h-full overflow-y-auto">
            <div className="space-y-1">{formatCode(code)}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
