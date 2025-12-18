import { useCallback, useEffect, useRef, useState } from "react";

interface HydraCanvasProps {
  className?: string;
  code?: string;
}

export function HydraCanvas({ className, code }: HydraCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // biome-ignore lint/suspicious/noExplicitAny: Hydra instance is untyped
  const hydraRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);

  // biome-ignore lint/suspicious/noExplicitAny: Hydra instance is untyped
  const runCode = useCallback((codeString: string, hydraInstance: any) => {
    setError(null);
    try {
      if (!hydraInstance) return;

      let executableCode = codeString;

      // Attempt to decode if it looks like encoded string
      // 1. Try URL decode first (if it contains %)
      let encodedCandidate = codeString;
      try {
        if (encodedCandidate.includes("%")) {
          encodedCandidate = decodeURIComponent(encodedCandidate);
        }
      } catch {
        // ignore
      }

      // 2. Try Base64 decode + URI decode (Hydra standard format)
      try {
        // Check if candidate looks like Base64 (simple check)
        if (/^[a-zA-Z0-9+/=-]+$/.test(encodedCandidate)) {
          const atobDecoded = window.atob(encodedCandidate);
          executableCode = decodeURIComponent(atobDecoded);
        }
      } catch {
        // failed to decode, fallback to original codeString (or URL decoded version if that's what we have?)
        // Actually if URL decode succeeded but Base64 failed, it might just be plain text with % symbols.
        // But safe to assume if atob failed, it's not the Hydra encoded format.
      }

      // Function constructor allows executing code with specific scope
      // using 'with' to emulate global scope within the instance
      // "use strict" is not applied to the body of new Function by default, so "with" is allowed.
      new Function(
        "h",
        `
        with(h) {
          ${executableCode}
        }
      `,
      )(hydraInstance);
    } catch (e) {
      console.error("Hydra execution error:", e);
      if (e instanceof Error) {
        setError(`Error: ${e.message}`);
      } else {
        setError(String(e));
      }
    }
  }, []);

  useEffect(() => {
    // biome-ignore lint/suspicious/noExplicitAny: Hydra instance is untyped
    let hydra: any;
    let resizeObserver: ResizeObserver;

    const init = async () => {
      if (!canvasRef.current || hydraRef.current) return;

      // Polyfill global for hydra-synth dependencies
      if (typeof window !== "undefined" && !window.global) {
        // biome-ignore lint/suspicious/noExplicitAny: polyfill
        (window as any).global = window;
      }

      try {
        // Dynamic import to avoid SSR issues
        // @ts-expect-error
        const Hydra = (await import("hydra-synth")).default;

        hydra = new Hydra({
          canvas: canvasRef.current,
          detectAudio: false,
          makeGlobal: false,
        }).synth;

        hydraRef.current = hydra;

        if (code) {
          runCode(code, hydra);
        } else {
          // Default visual
          hydra.osc(10, 0.1, 0.8).rotate(0, 0.1).out();
        }

        // Auto-resize
        resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const { width, height } = entry.contentRect;
            hydra?.setResolution?.(width, height);
          }
        });
        resizeObserver.observe(canvasRef.current);
      } catch (e: any) {
        console.error("Failed to initialize Hydra:", e);
        setError(`Failed to initialize Hydra: ${e.message || String(e)}`);
      }
    };

    init();

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (hydraRef.current) {
        // Clean up Hydra/Regl resources
        try {
          // Check if regl instance exists and destroy it to free WebGL context
          hydraRef.current.regl?.destroy?.();
        } catch (e) {
          console.error("Error cleaning up hydra:", e);
        }
      }
    };
    // Initialize once on mount
  }, []);

  // Update code when prop changes
  useEffect(() => {
    if (hydraRef.current && code) {
      runCode(code, hydraRef.current);
    }
  }, [code, runCode]);

  return (
    <div className={`relative ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
      {error && (
        <div className="absolute top-0 left-0 w-full p-2 bg-black/80 text-red-500 font-mono text-xs overflow-auto max-h-full pointer-events-none">
          {error}
        </div>
      )}
    </div>
  );
}
