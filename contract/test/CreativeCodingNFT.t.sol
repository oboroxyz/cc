// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Test, console2} from "forge-std/Test.sol";
import {CreativeCodingNFT} from "../src/CreativeCodingNFT.sol";

contract CreativeCodingNFTTest is Test {
    CreativeCodingNFT public nft;
    address public user1 = address(0x1);
    address public user2 = address(0x2);

    function setUp() public {
        nft = new CreativeCodingNFT();
    }

    // 1. Test for Standard NFT (Not SBT)
    function testMintNormal() public {
        string memory uri = "ipfs://QmTest...";

        // user1 mints a token (SBT = false)
        vm.prank(user1);
        nft.mint(user1, uri, false);

        assertEq(nft.ownerOf(0), user1); // Should be ID 0
        assertEq(nft.tokenURI(0), uri);
        assertEq(nft.isSoulbound(0), false);
        assertEq(nft.currentTokenId(), 1); // Counter should increment to 1

        // Transfer test: user1 -> user2 (Should succeed)
        vm.prank(user1);
        nft.transferFrom(user1, user2, 0);
        assertEq(nft.ownerOf(0), user2);
    }

    // 2. Test for Soulbound Token (SBT)
    function testMintSBT() public {
        string memory uri = "ipfs://QmSBT...";

        // user1 mints a token (SBT = true)
        vm.prank(user1);
        nft.mint(user1, uri, true); // ID 0

        assertEq(nft.isSoulbound(0), true);

        // Transfer test: user1 -> user2 (Should fail)
        vm.prank(user1);
        vm.expectRevert(CreativeCodingNFT.SoulboundTokenCannotBeTransferred.selector);
        nft.transferFrom(user1, user2, 0);
    }

    // 3. Test for Sequential IDs
    function testSequentialIDs() public {
        nft.mint(user1, "uri1", false); // ID 0
        nft.mint(user1, "uri2", false); // ID 1
        nft.mint(user1, "uri3", false); // ID 2

        assertEq(nft.ownerOf(0), user1);
        assertEq(nft.ownerOf(1), user1);
        assertEq(nft.ownerOf(2), user1);
        assertEq(nft.currentTokenId(), 3);
    }

    // 4. Test for Burning
    function testBurn() public {
        nft.mint(user1, "uri", true); // ID 0 is SBT

        // Even SBTs should be burnable by the owner
        vm.prank(user1);
        nft.burn(0);

        // Verify token no longer exists
        vm.expectRevert(abi.encodeWithSignature("TokenDoesNotExist()"));
        nft.tokenURI(0);
    }
}
