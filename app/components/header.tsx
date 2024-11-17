import React from "react";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function Header() {
  return (
    <div className="container flex h-24 items-center justify-between px-8">
      <p className="text-lg font-semibold mt-4 p-0">Translate App</p>
      <ModeToggle />
    </div>
  );
}
