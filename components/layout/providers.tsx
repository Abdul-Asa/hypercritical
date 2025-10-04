import { Provider as JotaiProvider } from "jotai";
import { ThemeProvider } from "./mode-toggle";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <ThemeProvider attribute="class" enableSystem defaultTheme="dark">
        {children}
      </ThemeProvider>
    </JotaiProvider>
  );
}
