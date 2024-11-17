"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("en"); // デフォルトは英語

  const handleTranslate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          targetLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch translation");
      }

      const data = await response.json();
      setTranslatedText(data.translation || "Error in translation");
    } catch (error) {
      console.error(error);
      setTranslatedText("Error during translation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='my-8 container '>
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-center">Translation App</h1>
      <Textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Type your text here..."
        className="w-full h-40"
      />
      <div className="flex justify-center space-x-4">
        <Button
          variant={targetLanguage === "en" ? "default" : "outline"}
          onClick={() => setTargetLanguage("en")}
        >
          English
        </Button>
        <Button
          variant={targetLanguage === "ja" ? "default" : "outline"}
          onClick={() => setTargetLanguage("ja")}
        >
          日本語
        </Button>
      </div>
      <Button
        onClick={handleTranslate}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Translating..." : "Translate"}
      </Button>
      {translatedText && (
        <div className="p-4  border-2 rounded-md">
          <h2 className="text-lg font-semibold">Translated Text:</h2>
          <p className="p-1">{translatedText}</p>
        </div>
      )}
      </div>
      </section>
  );
}
