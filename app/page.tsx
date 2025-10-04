"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/dashboard/footer";
import { TestScriptSidebar } from "@/components/dashboard/test-script-sidebar";
import { TestScriptViewer } from "@/components/dashboard/test-script-viewer";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useMobile } from "@/hooks/useMobile";

export default function Home() {
  const isMobile = useMobile();

  return (
    <div className="flex flex-col min-h-screen w-screen bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {isMobile ? (
          <div className="flex flex-col flex-1 p-6 gap-6">
            <div className="flex-shrink-0">
              <TestScriptSidebar />
            </div>
            <div className="flex-1">
              <TestScriptViewer />
            </div>
          </div>
        ) : (
          <ResizablePanelGroup direction="horizontal" className="h-full p-6">
            <ResizablePanel defaultSize={35} minSize={25}>
              <div className="h-full pr-3">
                <TestScriptSidebar />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={65} minSize={45}>
              <div className="h-full pl-3">
                <TestScriptViewer />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
        <Footer />
      </main>
    </div>
  );
}
