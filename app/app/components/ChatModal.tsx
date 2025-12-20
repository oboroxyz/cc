import { useState } from "react";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCode: (code: string) => void;
  currentCode?: string;
}

export function ChatModal({
  isOpen,
  onClose,
  onApplyCode,
  currentCode,
}: ChatModalProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input, code: currentCode }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate code");
      }

      const data = (await response.json()) as { code?: string };
      if (data.code) {
        onApplyCode(data.code);
        setInput("");
        onClose(); // Auto close on success
      }
    } catch (error) {
      console.error("Generation error:", error);
      alert("Failed to generate code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-black border-white border relative">
        {/* Input Area */}
        <div>
          <textarea
            className="w-full bg-black p-3 text-white focus:outline-none min-h-[120px]"
            placeholder="Describe how you want to change the visual... (e.g., 'Make it red', 'Add kaleidoscope')"
            value={input}
            cols={40}
            rows={2}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
        </div>
        {/* Actions */}
        <div className="flex items-center justify-center border-t border-white">
          <button
            type="button"
            onClick={onClose}
            className="text-white transition cursor-pointer text-xl flex-1"
          >
            ✕
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className="flex-1 h-10 flex items-center justify-center transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="animate-spin text-xl">↻</span>
            ) : (
              "⌲ Apply"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
