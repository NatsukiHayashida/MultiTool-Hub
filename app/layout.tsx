import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ui/theme-provider";

import Header from "./components/header"; // Header コンポーネントを再利用

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MultiToolHub",
  description: "仕事で使うツールをまとめたサイトです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={cn(
          inter.className,
          "min-h-dvh bg-background text-foreground"
        )}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="container mx-auto p-4">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
