import { createPublicClient, http } from "viem";
import { HydraCanvas } from "~/components/HydraCanvas";
import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  CONTRACT_CHAIN,
} from "~/lib/contract";
import type { Route } from "./+types/feed";

interface NFTItem {
  id: number;
  name?: string;
  code: string;
  owner: string;
}

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Feed | Hydra NFT" },
    { name: "description", content: "Explore Hydra generative art NFTs" },
  ];
}

export async function loader(_: Route.LoaderArgs) {
  const client = createPublicClient({
    chain: CONTRACT_CHAIN,
    transport: http(),
  });

  try {
    const totalSupply = await client.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "totalSupply",
    });

    const nfts: NFTItem[] = [];

    // Fetch each NFT (newest first)
    for (let i = Number(totalSupply); i >= 1; i--) {
      try {
        const [tokenURI, owner] = await Promise.all([
          client.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: "tokenURI",
            args: [BigInt(i)],
          }),
          client.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: "ownerOf",
            args: [BigInt(i)],
          }),
        ]);

        // Parse metadata
        let metadata: { animation_url?: string; name?: string };
        if (tokenURI.startsWith("data:application/json")) {
          const base64Data = tokenURI.replace(
            "data:application/json;base64,",
            ""
          );
          metadata = JSON.parse(atob(base64Data));
        } else {
          continue;
        }

        if (!metadata.animation_url) continue;

        // Extract code from animation_url
        const animationUrl = new URL(
          metadata.animation_url.replace("ipfs://", "https://ipfs.io/ipfs/")
        );
        const codeParam = animationUrl.searchParams.get("code");
        if (!codeParam) continue;

        const code = decodeURIComponent(atob(codeParam));

        nfts.push({
          id: i,
          name: metadata.name,
          code,
          owner: owner as string,
        });
      } catch {
        // Skip invalid tokens
      }
    }

    return { nfts };
  } catch (error) {
    console.error("Failed to fetch NFTs:", error);
    return { nfts: [] };
  }
}

export default function Feed({ loaderData }: Route.ComponentProps) {
  const { nfts } = loaderData;

  return (
    <div className="container max-w-screen-sm mx-auto px-4 py-8">
      <h1 className="text-3xl text-center py-8">Feed</h1>

      {nfts.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          No NFTs minted yet.{" "}
          <a href="/create" className="underline">
            Create one!
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {nfts.map((nft) => (
            <a
              key={nft.id}
              href={`/a/${nft.id}`}
              className="block bg-black/50 border border-white/20 hover:border-white/50 transition-colors"
            >
              <HydraCanvas code={nft.code} className="w-full aspect-square" />
              <div className="p-3 flex justify-between items-center">
                <div>
                  <span className="text-white/60">#{nft.id}</span>
                  {nft.name && (
                    <span className="ml-2 text-white">{nft.name}</span>
                  )}
                </div>
                <span className="text-white/40 text-sm font-mono">
                  {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
