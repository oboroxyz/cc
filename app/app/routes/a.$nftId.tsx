import { useState } from "react";
import { createPublicClient, http } from "viem";
import { CodeViewer } from "~/components/CodeViewer";
import { HydraCanvas } from "~/components/HydraCanvas";
import { CONTRACT_ABI, CONTRACT_ADDRESS, CONTRACT_CHAIN } from "~/lib/contract";
import type { Route } from "./+types/a.$nftId";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Artwork #${params.nftId} | Creative Coding` },
    { name: "description", content: "View Hydra artwork NFT" },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const { nftId } = params;

  if (!nftId || !/^\d+$/.test(nftId)) {
    throw new Response("Invalid NFT ID", { status: 400 });
  }

  const client = createPublicClient({
    chain: CONTRACT_CHAIN,
    transport: http(),
  });

  try {
    const tokenURI = await client.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "tokenURI",
      args: [BigInt(nftId)],
    });

    // Fetch metadata from tokenURI
    let metadata: { animation_url?: string; name?: string };

    if (tokenURI.startsWith("data:application/json")) {
      // Handle base64 encoded JSON
      const base64Data = tokenURI.replace("data:application/json;base64,", "");
      metadata = JSON.parse(atob(base64Data));
    } else if (tokenURI.startsWith("ipfs://")) {
      // Convert IPFS URL to HTTP gateway
      const httpUrl = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      const res = await fetch(httpUrl);
      metadata = await res.json();
    } else {
      const res = await fetch(tokenURI);
      metadata = await res.json();
    }

    if (!metadata.animation_url) {
      throw new Response("NFT has no animation_url", { status: 404 });
    }

    // Extract code from animation_url
    // Expected format: https://...?code=BASE64_CODE or ipfs://...?code=BASE64_CODE
    const animationUrl = new URL(
      metadata.animation_url.replace("ipfs://", "https://ipfs.io/ipfs/"),
    );
    const codeParam = animationUrl.searchParams.get("code");

    if (!codeParam) {
      throw new Response("animation_url has no code parameter", {
        status: 404,
      });
    }

    const code = decodeURIComponent(atob(codeParam));

    return {
      nftId,
      code,
      hash: codeParam,
      name: metadata.name,
    };
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error("Failed to fetch NFT:", error);
    throw new Response(
      `NFT #${nftId} not found. The token may not exist yet or there was an error fetching from the contract.`,
      { status: 404 }
    );
  }
}

export default function ArtworkByNftId({ loaderData }: Route.ComponentProps) {
  const { nftId, code, hash, name } = loaderData;
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

      {/* NFT Info */}
      <div className="fixed top-2 left-2 z-10 bg-black/80 backdrop-blur px-3 py-1 text-white text-sm">
        #{nftId} {name && `- ${name}`}
      </div>

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
