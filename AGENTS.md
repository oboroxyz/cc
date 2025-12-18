# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CreativeCodingNFT is an NFT toolkit for creative coding artwork built on Base blockchain. The project integrates Hydra visual synthesizer for generative art with NFT minting capabilities, including support for Soulbound Tokens (SBT).

## Repository Structure

This is a pnpm workspace monorepo with three main components:

- **app/** - React Router v7 web application (Farcaster miniapp) deployed on Cloudflare
- **viewer/** - Standalone HTML/JS viewer for Hydra artwork (deployed to IPFS)
- **contract/** - Solidity smart contract using Foundry framework

## Common Development Commands

### Root-level operations

```shell
# Install all dependencies
pnpm i

# Run commands in specific workspace
pnpm @app run <script>
pnpm @viewer run <script>

# Format/lint all code
pnpm biome check
pnpm biome check --write
```

### App (React Router + Cloudflare)

```shell
# Development server
pnpm @app run dev

# Build and deploy to Cloudflare
pnpm @app run deploy

# Type checking
pnpm @app run typecheck

# Generate Cloudflare Workers types
pnpm @app run cf-typegen
```

### Viewer (IPFS-ready Hydra viewer)

```shell
# Development (opens HTML in browser)
pnpm @viewer run dev:hydra

# Build for IPFS (minified, self-contained)
pnpm @viewer run build:hydra
```

### Contract (Foundry/Solidity)

```shell
cd contract

# Install dependencies
forge install

# Build contracts
forge build

# Run tests
forge test

# Run specific test
forge test --match-test <testName>

# Deploy contract
forge script script/CreativeCodingNFT.s.sol:DeployCreativeCodingNFT --rpc-url <RPC_URL> --broadcast

# Format Solidity code
forge fmt
```

## Architecture

### App Architecture (React Router v7)

- **Framework**: React Router v7 with SSR, deployed on Cloudflare Workers
- **Routing**: File-based routing via `@react-router/fs-routes` in `app/routes/`
- **Blockchain**: Base chain integration via wagmi + viem
- **Farcaster**: Integrated as miniapp using `@farcaster/miniapp-sdk` and Quick Auth
- **OnchainKit**: Coinbase OnchainKit for wallet and transaction components
- **Styling**: Tailwind CSS v4

Key files:
- `app/app/root.tsx` - Root layout and error boundary
- `app/app/routes.ts` - Routes configuration (uses flatRoutes)
- `app/app/minikit.config.ts` - Farcaster miniapp configuration
- `app/app/components/HydraCanvas.tsx` - React component wrapper for Hydra synthesizer

### Viewer Architecture

The viewer is a **self-contained HTML file** designed for IPFS deployment:

- **Purpose**: Render Hydra artwork from URL parameters
- **Input**: Accepts `?code=<base64>` parameter containing encoded Hydra code
- **Build process**: Inlines hydra-synth library and minifies to single HTML file
- **Encoding**: Base64 + URI encoding (`atob(code)` then `decodeURIComponent()`)

Build script (`viewer/build.mjs`):
1. Fetches `hydra-synth` from unpkg CDN
2. Inlines the library into HTML
3. Minifies everything into `dist/hydra.html`

### Contract Architecture (CreativeCodingNFT.sol)

- **Standard**: ERC721 using Solady library (gas-optimized)
- **Features**:
  - Permissionless minting with custom metadata URIs
  - Soulbound Token (SBT) support - tokens can be marked non-transferable
  - Individual token burn functionality
- **Access Control**: Ownable pattern from Solady

Key functions:
- `mint(address to, string uri, bool _isSbt)` - Mint NFT with optional SBT flag
- `burn(uint256 id)` - Burn owned token
- `transferFrom()` - Overridden to prevent SBT transfers

## Hydra Integration

Hydra is a video synthesizer for live coding visuals. Both app and viewer integrate it differently:

**App (HydraCanvas.tsx)**:
- Imports `hydra-synth` as npm package
- Uses `makeGlobal: false` to avoid polluting global scope
- Executes code via Function constructor with Hydra instance scope
- Auto-resizes using ResizeObserver

**Viewer (hydra.html)**:
- Uses `makeGlobal: true` for compatibility with official Hydra code format
- Executes code directly via `eval()` (safe in isolated IPFS context)
- Reads code from URL query parameter

## Technology Stack

- **Frontend**: React 19, React Router v7, TypeScript, Tailwind CSS v4
- **Backend**: Cloudflare Workers (serverless)
- **Smart Contracts**: Solidity ^0.8.30, Foundry, Solady
- **Blockchain**: Base (L2), wagmi, viem
- **Creative Coding**: hydra-synth
- **Code Quality**: Biome (formatting + linting)
- **Package Manager**: pnpm with workspaces

## Development Notes

- **Biome config** (`biome.jsonc`): Uses double quotes, space indentation, organizes imports automatically
- **Hydra code execution**: When working with Hydra code in the app, ensure it's compatible with `makeGlobal: false` by using the Function constructor pattern
- **IPFS viewer**: The viewer build must remain self-contained (no external dependencies) for IPFS compatibility
- **Contract testing**: All Foundry tests are in `contract/test/CreativeCodingNFT.t.sol`
- **Deployment**: App deploys via Wrangler CLI to Cloudflare, viewer outputs to `viewer/dist/hydra.html` for IPFS pinning
