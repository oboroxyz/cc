// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import {Script, console} from "forge-std/Script.sol";
import {CreativeCodingNFT} from "../src/CreativeCodingNFT.sol";

contract DeployCreativeCodingNFT is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        CreativeCodingNFT nft = new CreativeCodingNFT();
        console.log("CreativeCodingNFT deployed at:", address(nft));

        vm.stopBroadcast();
    }
}
