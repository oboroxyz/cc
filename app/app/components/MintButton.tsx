import { useCallback } from "react";

export function MintButton() {
  const handleMint = useCallback(() => {
    alert(
      "Minting functionality is currently mocked. Integration with MiniKit coming soon!",
    );
    console.log("Mint button clicked - Mock implementation");
  }, []);

  return (
    <button
      type="button"
      onClick={handleMint}
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
    >
      Mint NFT
    </button>
  );
}
