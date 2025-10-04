"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import { ReactNode } from "react";

interface AlertWithTriggerProps {
  trigger: ReactNode;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "default";
  onConfirm: () => void;
  onCancel?: () => void;
}

export function AlertWithTrigger({
  trigger,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  onConfirm,
  onCancel,
}: AlertWithTriggerProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="w-full max-w-md mx-4">
        <AlertDialogHeader className="text-left">
          <div className="flex items-center space-x-3">
            {variant === "destructive" && (
              <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <AlertDialogTitle className="text-lg font-semibold text-foreground">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-muted-foreground mt-1">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex justify-end space-x-2 pt-4">
          <AlertDialogCancel
            onClick={handleCancel}
            className="text-muted-foreground hover:text-foreground"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={cn(
              variant === "destructive"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
            )}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
