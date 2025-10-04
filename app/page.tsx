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
import { ScriptItem } from "@/lib/data";

export default function Home() {
  const [selectedScript, setSelectedScript] = useState<ScriptItem | null>(null);

  return (
    <div className="flex flex-col min-h-screen w-screen bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <ResizablePanelGroup direction="horizontal" className="h-full p-6">
          {/* Sidebar Panel */}
          <ResizablePanel defaultSize={40} minSize={25}>
            <div className="h-full pr-3">
              <TestScriptSidebar
                selectedScript={selectedScript}
                onScriptSelect={setSelectedScript}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Main Viewer Panel */}
          <ResizablePanel defaultSize={75} minSize={45}>
            <div className="h-full pl-3 min-h-screen">
              <TestScriptViewer selectedScript={selectedScript} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
        <Footer />
      </main>
    </div>
  );
}
