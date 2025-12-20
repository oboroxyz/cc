import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from "@coinbase/onchainkit/transaction";
import { ConnectWallet, Wallet } from "@coinbase/onchainkit/wallet";
import type { ReactNode } from "react";
import { encodeFunctionData } from "viem";
import { useAccount } from "wagmi";
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

  if (!isConnected || !address) {
    return (
      <Wallet>
        <ConnectWallet className="btn py-2 px-4">
          <span>Connect</span>
        </ConnectWallet>
      </Wallet>
    );
  }

  const calls = [
    {
      to: CONTRACT_ADDRESS as `0x${string}`,
      data: encodeFunctionData({
        abi: CONTRACT_ABI,
        functionName: "mint",
        args: [address, uri, isSbt],
      }),
    },
  ];

  return (
    <Transaction
      calls={calls}
      onSuccess={(response) => {
        if (onSuccess && response.transactionReceipts?.[0]?.transactionHash) {
          onSuccess(response.transactionReceipts[0].transactionHash);
        }
      }}
    >
      <TransactionButton
        text={String(children ?? "Mint")}
        className="btn py-2 px-4"
      />
      <TransactionStatus>
        <TransactionStatusLabel />
        <TransactionStatusAction />
      </TransactionStatus>
    </Transaction>
  );
}
