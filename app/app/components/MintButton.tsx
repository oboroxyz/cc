import type { ReactNode } from "react";
import { useAccount, useConnect, useWriteContract } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "~/lib/contract";

interface NFTMetadata {
  name?: string;
  description?: string;
  image?: string;
  image_data?: string;
  external_url?: string;
  animation_url?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

interface MintButtonProps {
  children?: ReactNode;
  code: string;
  viewerCid: string;
  metadata?: NFTMetadata;
  isSbt?: boolean;
  onSuccess?: (txHash: string) => void;
}

export function MintButton({
  children,
  code,
  viewerCid,
  metadata,
  isSbt = false,
  onSuccess,
}: MintButtonProps) {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const {
    writeContract,
    isPending,
    isSuccess,
    data: txHash,
  } = useWriteContract();

  const encodedCode = btoa(encodeURIComponent(code));
  const animationUrl = `ipfs://${viewerCid}?code=${encodedCode}`;

  const nftMetadata: NFTMetadata = {
    name: metadata?.name ?? "Hydra Artwork",
    description:
      metadata?.description ??
      "Creative coding artwork generated with Hydra video synth",
    animation_url: metadata?.animation_url ?? animationUrl,
    external_url: metadata?.external_url ?? animationUrl,
    attributes: metadata?.attributes ?? [
      { trait_type: "Generator", value: "Hydra" },
      { trait_type: "Type", value: "Generative Art" },
    ],
    ...(metadata?.image && { image: metadata.image }),
    ...(metadata?.image_data && { image_data: metadata.image_data }),
  };

  const uri = `data:application/json;base64,${btoa(JSON.stringify(nftMetadata))}`;

  const handleMint = () => {
    if (!address) return;

    writeContract(
      {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "mint",
        args: [address, uri, isSbt],
      },
      {
        onSuccess: (hash) => {
          onSuccess?.(hash);
        },
      },
    );
  };

  if (!isConnected || !address) {
    return (
      <button
        type="button"
        className="btn py-2 px-4"
        onClick={() => connect({ connector: connectors[0] })}
      >
        Connect to Mint
      </button>
    );
  }

  if (isSuccess && txHash) {
    return <span className="btn py-2 px-4 text-green-400">Minted!</span>;
  }

  return (
    <button
      type="button"
      className="btn py-2 px-4"
      onClick={handleMint}
      disabled={isPending}
    >
      {isPending ? "Minting..." : (children ?? "Mint")}
    </button>
  );
}
