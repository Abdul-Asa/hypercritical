"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "default";
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <Card className="relative z-10 w-full max-w-md mx-4 p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {variant === "destructive" && (
              <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            variant={variant === "destructive" ? "destructive" : "default"}
            className={cn(
              variant === "destructive" &&
                "bg-red-600 hover:bg-red-700 text-white"
            )}
          >
            {confirmText}
          </Button>
        </div>
      </Card>
    </div>
  );
}
