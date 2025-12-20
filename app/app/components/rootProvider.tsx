import { OnchainKitProvider } from "@coinbase/onchainkit";
import { SafeArea } from "@coinbase/onchainkit/minikit";
import { sdk } from "@farcaster/miniapp-sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";

interface RootProviderProps {
  children: ReactNode;
  apiKey?: string;
}

function RootApp({ children }: { children: ReactNode }) {
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return <SafeArea>{children}</SafeArea>;
}

export default function RootProvider({ children, apiKey }: RootProviderProps) {
  const [isMounted, setIsMounted] = useState(false);

  const wagmiConfig = useMemo(
    () =>
      createConfig({
        chains: [baseSepolia],
        connectors: [
          coinbaseWallet({
            appName: "Creative Coding NFT",
            preference: {
              options: "smartWalletOnly",
            },
          }),
        ],
        transports: {
          [baseSepolia.id]: http(),
        },
      }),
    [],
  );

  const queryClient = useMemo(() => new QueryClient(), []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={apiKey}
          chain={baseSepolia}
          config={{
            appearance: {
              mode: "auto",
            },
            wallet: {
              display: "modal",
            },
          }}
          miniKit={{
            enabled: true,
            autoConnect: true,
          }}
        >
          <RootApp>{children}</RootApp>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
