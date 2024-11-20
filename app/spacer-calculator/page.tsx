"use client";

import { useState } from "react";
import { spacerStock } from "./spacerData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SpacerCalculator() {
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [results, setResults] = useState<number[][]>([]);
  const [allResults, setAllResults] = useState<number[][]>([]);
  const [isApproximation, setIsApproximation] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  function findCombinations(spacerStock: number[], targetHeight: number) {
    const allResults: number[][] = [];
    let closestSum = 0;
    let closestCombination: number[] = [];

    // スペーサーリストをソート（重複を排除しやすくするため）
    const sortedStock = spacerStock.sort((a, b) => a - b);

    function dfs(index: number, current: number[], sum: number) {
      if (sum > targetHeight) return;
      if (sum > closestSum && sum <= targetHeight) {
        closestSum = sum;
        closestCombination = [...current];
      }
      if (sum === targetHeight) {
        allResults.push([...current]);
        return;
      }
      for (let i = index; i < sortedStock.length; i++) {
        current.push(sortedStock[i]);
        dfs(i + 1, current, sum + sortedStock[i]);
        current.pop();
      }
    }

    dfs(0, [], 0);

    setIsApproximation(allResults.length === 0);

    // 重複した組み合わせを排除
    const uniqueResults = Array.from(
      new Set(allResults.map((combo) => combo.sort((a, b) => a - b).join(",")))
    ).map((combo) => combo.split(",").map(Number));

    // 最小スペーサー数で絞り込み
    if (uniqueResults.length > 0) {
      const minCount = Math.min(...uniqueResults.map((combo) => combo.length));
      const filteredResults = uniqueResults.filter(
        (combo) => combo.length === minCount
      );
      return { results: filteredResults, allResults: uniqueResults };
    }

    return { results: [closestCombination], allResults: uniqueResults };
  }

  const handleCalculate = () => {
    if (targetHeight <= 0) {
      setErrorMessage("正の数値を入力してください。");
      return;
    }
    setErrorMessage("");
    setIsLoading(true);
    const { results, allResults } = findCombinations(spacerStock, targetHeight);
    setResults(results);
    setAllResults(allResults);
    setIsLoading(false);
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
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <Button onClick={handleCalculate} className="w-full" disabled={isLoading}>
              {isLoading ? "計算中..." : "計算する"}
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="mt-6">
        {results.length > 0 ? (
          <div>
            <Card className="shadow-lg mb-4">
              <CardHeader>
                <CardTitle>結果</CardTitle>
                {isApproximation && (
                  <CardDescription className="text-red-500">
                    近似値として計算されています。
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-2">
                  {allResults.length > results.length &&
                    "以下は最小スペーサー数の組み合わせです。他にも組み合わせがあります。"}
                </p>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-96">
              {results.map((combo, index) => (
                <Card key={index} className="shadow-md hover:shadow-lg transition">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-blue-600">
                      {combo.reduce((sum, val) => sum + val, 0)} mm
                    </CardTitle>
                    <CardDescription>
                      スペーサー数: {combo.length}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground text-lg ">
                      {combo.join("mm + ")}mm
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">結果がありません。</p>
        )}
      </div>
    </div>
  );
}
