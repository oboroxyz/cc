import { useCallback } from "react";

export function MintButton({
  children,
}: {
  children?: string | React.ReactNode;
}) {
  const handleMint = useCallback(() => {
    alert(
      "Minting functionality is currently mocked. Integration with MiniKit coming soon!",
    );
    console.log("Mint button clicked - Mock implementation");
  }, []);

  return (
    <button type="button" onClick={handleMint} className="btn py-2 px-4">
      {children ?? "Mint"}
    </button>
  );
}
