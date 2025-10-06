"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { cn, getShortId } from "@/lib/utils";
import { ScriptItem } from "@/lib/data";
import { useSetAtom, useAtomValue } from "jotai";
import {
  deleteScriptAtom,
  updateScriptAtom,
  selectScriptAtom,
  selectedScriptAtom,
} from "@/lib/atoms";
import { Check, X, Trash2 } from "lucide-react";
import { AlertWithTrigger } from "./alert-with-trigger";

interface ScriptButtonProps {
  script: ScriptItem;
}

export const ScriptButton = memo(function ScriptButton({
  script,
}: ScriptButtonProps) {
  const deleteScript = useSetAtom(deleteScriptAtom);
  const updateScript = useSetAtom(updateScriptAtom);
  const selectScript = useSetAtom(selectScriptAtom);
  const selectedScript = useAtomValue(selectedScriptAtom);

  const handleAcceptToggle = (scriptId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateScript({
      scriptId,
      updates: { isAccepted: !script.isAccepted },
    });
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
});
