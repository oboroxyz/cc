import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css";

interface CodeViewerProps {
  code: string;
  className?: string;
}

export function CodeViewer({ code, className = "" }: CodeViewerProps) {
  const highlighted = Prism.highlight(
    code,
    Prism.languages.javascript,
    "javascript"
  );

  return (
    <div
      className={`bg-black/20 backdrop-blur-xs font-mono text-sm px-3 pt-1 pb-2 ${className}`}
    >
      <pre
        className="min-h-full max-w-full whitespace-pre-wrap"
        style={{
          fontSize: 14,
          padding: 16,
          color: "#f0f0f0",
          textShadow: "0 1px 2px rgba(0,0,0,0.8)",
          wordBreak: "break-word",
        }}
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </div>
  );
}
