// Syntax highlighting imports
import Prism from "prismjs";
import { useCallback, useState } from "react";
import Editor from "react-simple-code-editor";
import { ChatModal } from "~/components/ChatModal";
import { HydraCanvas } from "~/components/HydraCanvas";
import { MintButton } from "~/components/MintButton";
import type { Route } from "./+types/create";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css"; // Similar to official editor vibe

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Create | Creative Coding" },
    { name: "description", content: "Create and Mint your hydra visuals" },
  ];
}

const DEFAULT_CODE = `osc(5,-0.126,0.514).rotate().pixelate().out()`;

export default function Create(_: Route.ComponentProps) {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [previewCode, setPreviewCode] = useState(DEFAULT_CODE);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const handleApplyCode = useCallback((newCode: string) => {
    setCode(newCode);
    setPreviewCode(newCode);
    setIsChatOpen(false);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onApplyCode={handleApplyCode}
        currentCode={code}
      />
      {/* Main Content: Overlay View */}
      <div className="flex-1 relative overflow-hidden">
        {/* Preview Pane - Full Background */}
        <div className="absolute inset-0 z-0">
          <HydraCanvas code={previewCode} className="w-full h-full" />
        </div>
        {/* Editor Pane - Overlay */}
        <div className="absolute top-0 left-0 h-full w-full max-w-screen z-10 pointer-events-none">
          <div className="h-auto overflow-auto bg-black/20 backdrop-blur-xs font-mono text-sm px-3 pt-1 pb-2 pointer-events-auto m-3">
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
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
              className="min-h-full max-w-full whitespace-pre-wrap"
              textareaClassName="focus:outline-none"
            />
          </div>
          <div className="fixed bottom-2 right-2 flex items-center gap-1 z-10 pointer-events-auto bg-black border-white border">
            <button
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-2 btn w-auto px-3 py-1"
              type="button"
            >
              💬 Ask with AI
            </button>
            <MintButton>💾 Mint</MintButton>
            <a
              href="https://hydra.ojack.xyz/docs/"
              className="flex items-center gap-2 btn w-auto px-3 py-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              📖
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
