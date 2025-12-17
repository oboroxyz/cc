// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {ERC721} from "solady/tokens/ERC721.sol";
import {LibString} from "solady/utils/LibString.sol";
import {Ownable} from "solady/auth/Ownable.sol";

contract CreativeCodingNFT is ERC721, Ownable {
    using LibString for uint256;

    error SoulboundTokenCannotBeTransferred();

    uint256 public currentTokenId;

    mapping(uint256 => bool) public isSoulbound;

    mapping(uint256 => string) private _tokenURIs;

    constructor() {
        _initializeOwner(msg.sender);
    }

    function name() public view virtual override returns (string memory) {
        return "CreativeCoding";
    }

    function symbol() public view virtual override returns (string memory) {
        return "CODE";
    }

    function tokenURI(uint256 id) public view virtual override returns (string memory) {
        if (!_exists(id)) revert TokenDoesNotExist();
        return _tokenURIs[id];
    }

    function mint(address to, string calldata uri, bool _isSbt) public {
        uint256 id = currentTokenId;

        currentTokenId++;

        _tokenURIs[id] = uri;
        if (_isSbt) {
            isSoulbound[id] = true;
        }

        _mint(to, id);
    }

    function burn(uint256 id) public {
        _burn(msg.sender, id);

        delete _tokenURIs[id];
        delete isSoulbound[id];
    }

    /*
     * @dev Mints a new token.
     * @param to The address to receive the token.
     * @param uri The metadata URI (e.g., ipfs://...).
     * @param _isSbt If true, the token becomes Soulbound (non-transferable).
     */
    function transferFrom(address from, address to, uint256 id) public payable virtual override {
        if (isSoulbound[id]) {
            revert SoulboundTokenCannotBeTransferred();
        }

        super.transferFrom(from, to, id);
    }
}
