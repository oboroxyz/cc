import { baseSepolia } from "viem/chains";

// TODO: Update with deployed contract address
export const CONTRACT_ADDRESS =
  "0x1E58CcBda369404EAfB7Ea47a0C37B2e63d0483B" as const;

export const CONTRACT_CHAIN = baseSepolia;

export const CONTRACT_ABI = [
  {
    inputs: [{ name: "id", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "uri", type: "string" },
      { name: "_isSbt", type: "bool" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
