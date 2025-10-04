"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/dashboard/footer";
import { TestScriptSidebar } from "@/components/dashboard/test-script-sidebar";
import { TestScriptViewer } from "@/components/dashboard/test-script-viewer";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScriptItem, mockScripts } from "@/lib/data";

export default function Home() {
  const [scripts, setScripts] = useState<ScriptItem[]>(mockScripts);
  const [selectedScript, setSelectedScript] = useState<ScriptItem | null>(null);

  // Handle script updates (save functionality)
  const handleScriptUpdate = (
    scriptId: string,
    updates: Partial<ScriptItem>
  ) => {
    setScripts((prev) =>
      prev.map((script) =>
        script.scriptId === scriptId ? { ...script, ...updates } : script
      )
    );

    // Update selected script if it's the one being updated
    if (selectedScript?.scriptId === scriptId) {
      setSelectedScript((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  // Handle script deletion
  const handleScriptDelete = (scriptId: string) => {
    setScripts((prev) => prev.filter((script) => script.scriptId !== scriptId));

    // Clear selection if the deleted script was selected
    if (selectedScript?.scriptId === scriptId) {
      setSelectedScript(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-screen bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <ResizablePanelGroup direction="horizontal" className="h-full p-6">
          {/* Sidebar Panel */}
          <ResizablePanel defaultSize={40} minSize={25}>
            <div className="h-full pr-3">
              <TestScriptSidebar
                scripts={scripts}
                selectedScript={selectedScript}
                onScriptSelect={setSelectedScript}
                onScriptUpdate={handleScriptUpdate}
                onScriptDelete={handleScriptDelete}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Main Viewer Panel */}
          <ResizablePanel defaultSize={75} minSize={45}>
            <div className="h-full pl-3 min-h-screen">
              <TestScriptViewer
                selectedScript={selectedScript}
                onScriptUpdate={handleScriptUpdate}
                onScriptDelete={handleScriptDelete}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
        <Footer />
      </main>
    </div>
  );
}
