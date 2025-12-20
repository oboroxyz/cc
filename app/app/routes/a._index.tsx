import { useState } from "react";
import { CodeViewer } from "~/components/CodeViewer";
import { HydraCanvas } from "~/components/HydraCanvas";
import type { Route } from "./+types/a._index";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Artwork | Creative Coding" },
    { name: "description", content: "View Hydra artwork" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const codeParam = url.searchParams.get("code");

  if (!codeParam) {
    throw new Response("Missing code parameter", { status: 400 });
  }

  try {
    const code = decodeURIComponent(atob(codeParam));
    return { hash: codeParam, code };
  } catch {
    return { hash: codeParam, code: codeParam };
  }
}

export default function ArtworkByCode({ loaderData }: Route.ComponentProps) {
  const { hash, code } = loaderData;
  const [showCode, setShowCode] = useState(false);

  return (
    <>
      <div className="absolute inset-0 z-0">
        <HydraCanvas code={code} className="w-full h-full absolute inset-0" />
      </div>

      {showCode && (
        <div className="absolute top-0 left-0 z-10 pointer-events-none m-3">
          <CodeViewer code={code} className="pointer-events-auto" />
        </div>
      )}

      <div className="fixed bottom-2 right-2 flex items-center gap-1 z-10 pointer-events-auto bg-black border-white border">
        <a
          className="flex items-center gap-2 btn w-auto px-3 py-1"
          href={`/create?code=${hash}`}
        >
          🍴 Fork
        </a>
        <button
          className="flex items-center gap-2 btn w-auto px-3 py-1"
          type="button"
          onClick={() => setShowCode(!showCode)}
        >
          {showCode ? "✕ Hide code" : "👨‍💻 View code"}
        </button>
        <a
          className="flex items-center gap-2 btn w-auto px-3 py-1"
          href="/feed"
        >
          🔍 Explore others
        </a>
      </div>
    </>
  );
}
