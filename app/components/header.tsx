import React from "react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Link from "next/link"; // Linkをインポート

export default function Header() {
  return (
    <div className="container flex h-24 items-center justify-between px-8">
      <Link href="/" className="text-lg font-semibold mt-4 p-0 hover:text-muted-foreground">
        MultiTool-Hub
      </Link>
      <ModeToggle />
    </div>
  );
}

