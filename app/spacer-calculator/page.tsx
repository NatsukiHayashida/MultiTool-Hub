"use client";

import { useState } from "react";
import { spacerStock } from "./spacerData"; // 在庫データをインポート
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SpacerCalculator() {
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [results, setResults] = useState<number[][]>([]);
  const [isApproximation, setIsApproximation] = useState<boolean>(false);

  function findCombinations(spacerStock: number[], targetHeight: number) {
    const results: number[][] = [];
    let closestSum = 0;
    let closestCombination: number[] = [];

    const combinations = (arr: number[], k: number): number[][] => {
      if (k === 0) return [[]];
      if (arr.length === 0) return [];
      const [first, ...rest] = arr;
      const includeFirst = combinations(rest, k - 1).map((combo) => [first, ...combo]);
      const excludeFirst = combinations(rest, k);
      return [...includeFirst, ...excludeFirst];
    };

    for (let i = 1; i <= spacerStock.length; i++) {
      const combos = combinations(spacerStock, i);
      combos.forEach((combo) => {
        const sum = combo.reduce((sum, val) => sum + val, 0);
        if (sum === targetHeight) {
          results.push(combo);
        }
        if (sum < targetHeight && sum > closestSum) {
          closestSum = sum;
          closestCombination = combo;
        }
      });
    }

    if (results.length === 0 && closestCombination.length > 0) {
      setIsApproximation(true);
      return [closestCombination];
    } else {
      setIsApproximation(false);
      return results;
    }
  }

  const handleCalculate = () => {
    const combinations = findCombinations(spacerStock, targetHeight);
    setResults(combinations);
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>スペーサー計算機能</CardTitle>
          <CardDescription>
            必要な高さを達成するスペーサーの組み合わせを計算します。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Input
              type="number"
              placeholder="必要な高さ (mm)"
              value={targetHeight || ""}
              onChange={(e) => setTargetHeight(Number(e.target.value))}
            />
            <Button onClick={handleCalculate} className="w-full">
              計算する
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="mt-6">
        {results.length > 0 ? (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>結果</CardTitle>
              {isApproximation && (
                <CardDescription className="text-red-500">
                  近似値として計算されています。
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <ul>
                {results.map((combo, index) => (
                  <li key={index}>
                    組み合わせ {index + 1}: {combo.join("mm, ")}mm
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ) : (
          <p className="text-center text-gray-500">結果がありません。</p>
        )}
      </div>
    </div>
  );
}
