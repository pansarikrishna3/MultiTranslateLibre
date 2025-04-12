import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

const languageCodes = [
  "af", "am", "ar", "az", "be", "bg", "bn", "bs", "ca", "ceb", "co", "cs", "cy",
  "da", "de", "el", "en", "eo", "es", "et", "eu", "fa", "fi", "fr", "fy", "ga", "gd", "gl",
  "gu", "ha", "haw", "he", "hi", "hmn", "hr", "ht", "hu", "hy", "id", "ig", "is", "it",
  "ja", "jw", "ka", "kk", "km", "kn", "ko", "ku", "ky", "la", "lb", "lo", "lt", "lv", "mg",
  "mi", "mk", "ml", "mn", "mr", "ms", "mt", "my", "ne", "nl", "no", "ny", "pa", "pl", "ps",
  "pt", "ro", "ru", "rw", "sd", "si", "sk", "sl", "sm", "sn", "so", "sq", "sr", "st", "su",
  "sv", "sw", "ta", "te", "tg", "th", "tk", "tl", "tr", "tt", "ug", "uk", "ur", "uz", "vi",
  "xh", "yi", "yo", "zh", "zu"
];

const translateWithLibre = async (text, from, to) => {
  const res = await fetch("https://libretranslate.com/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: text,
      source: from,
      target: to,
      format: "text",
    }),
  });

  const data = await res.json();
  return data?.translatedText || "";
};

export default function MultiTranslate() {
  const [text, setText] = useState("");
  const [startLang, setStartLang] = useState("en");
  const [endLang, setEndLang] = useState("es");
  const [times, setTimes] = useState(4);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    setLoading(true);
    let currentText = text;
    let currentLang = startLang;

    for (let i = 0; i < times - 1; i++) {
      const nextLang = languageCodes[(i % languageCodes.length)];
      if (nextLang === currentLang) continue;
      currentText = await translateWithLibre(currentText, currentLang, nextLang);
      currentLang = nextLang;
    }

    const finalText = await translateWithLibre(currentText, currentLang, endLang);
    setResult(finalText);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Multi-Language Translator</h1>
      <Input
        placeholder="Enter text to translate"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex gap-4 flex-wrap">
        <Select onValueChange={setStartLang} defaultValue={startLang}>
          <SelectTrigger>Start Language ({startLang})</SelectTrigger>
          <SelectContent>
            {languageCodes.map((code) => (
              <SelectItem key={code} value={code}>{code}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setEndLang} defaultValue={endLang}>
          <SelectTrigger>End Language ({endLang})</SelectTrigger>
          <SelectContent>
            {languageCodes.map((code) => (
              <SelectItem key={code} value={code}>{code}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="number"
          min={4}
          max={100}
          value={times}
          onChange={(e) => setTimes(Number(e.target.value))}
        />
      </div>

      <Button onClick={handleTranslate} disabled={loading}>
        {loading ? "Translating..." : "Translate"}
      </Button>

      {result && (
        <Card>
          <CardContent className="p-4">
            <p>{result}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
