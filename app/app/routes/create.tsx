// Syntax highlighting imports
import Prism from "prismjs";
import { useCallback, useEffect, useState } from "react";
import Editor from "react-simple-code-editor";
import { HydraCanvas } from "../components/HydraCanvas";
import { MintButton } from "../components/MintButton";
import type { Route } from "./+types/create";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css"; // Similar to official editor vibe

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Create - Hydra NFT" },
    { name: "description", content: "Create and Mint your Hydra Visuals" },
  ];
}

const DEFAULT_CODE = `osc(10, 0.1, 0.8).rotate(0, 0.1).out()`;

export default function Create(_: Route.ComponentProps) {
  const [code, setCode] = useState(DEFAULT_CODE);
  // Preview code is updated only when "Play" is clicked to avoid constant re-rendering
  const [previewCode, setPreviewCode] = useState(DEFAULT_CODE);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("hydra-draft");
    if (saved) {
      setCode(saved);
      setPreviewCode(saved);
    }
  }, []);

  const handlePlay = useCallback(() => {
    setPreviewCode(code);
  }, [code]);

  return (
    <div className="flex flex-col h-screen">
      {/* Main Content: Overlay View */}
      <div className="flex-1 relative overflow-hidden">
        {/* Preview Pane - Full Background */}
        <div className="absolute inset-0 z-0">
          <HydraCanvas code={previewCode} className="w-full h-full" />
        </div>
        {/* Editor Pane - Overlay */}
        <div className="absolute top-0 left-0 w-auto h-auto z-10 pointer-events-none min-w-2/3">
          <div className="h-full overflow-auto bg-black/20 backdrop-blur-xs font-mono text-sm px-3 pt-1 pb-2 pointer-events-auto m-3">
            <Editor
              value={code}
              onValueChange={setCode}
              onBlur={() => setPreviewCode(code)}
              highlight={(code) =>
                Prism.highlight(code, Prism.languages.javascript, "javascript")
              }
              padding={16}
              style={{
                fontSize: 14,
                minHeight: "100%",
                color: "#f0f0f0",
                textShadow: "0 1px 2px rgba(0,0,0,0.8)",
              }}
              className="min-h-full"
              textareaClassName="focus:outline-none"
            />
          </div>
          <div className="fixed bottom-0 right-0 flex gap-2 z-10">
            <button onClick={handlePlay} className="btn h-8" type="button">
              💬 Edit with chat
            </button>
            <button onClick={handlePlay} className="btn h-8" type="button">
              💾 Mint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
