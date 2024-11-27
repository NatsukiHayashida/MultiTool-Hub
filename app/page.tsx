"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font text-center mb-8">Welcome to the MultiTool-Hub</h1>
      <p className="text-center text-lg mb-6">以下の機能を選択してください</p>
      <div className="mt-6 grid gap-6 grid-cols-1 ">
      <Link href="/language-tools">
  <Card className="card transition-transform transform hover:scale-105">
    <CardHeader>
      <CardTitle className="text-lg font-semibold">翻訳機能</CardTitle>
      <CardDescription>文章の翻訳を簡単に行います。</CardDescription>
    </CardHeader>
  </Card>
</Link>

        <Link href="/spacer-calculator">
          <Card className="card transition-transform transform hover:scale-105">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">スペーサー計算</CardTitle>
              <CardDescription>
                必要な高さに調整するためのスペーサー組み合わせを計算します。
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </main>
  );
}
