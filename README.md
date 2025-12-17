# CreativeCodingNFT

A NFT toolkit for creative coding artwork.

## Deployments
- CreativeCodingNFT : `https://basescan.org/address/0x<TBD>`
- Hydra Viewer on IPFS : `https://ipfs.io/ipfs/bafkreiat3znewbxc7kweajzeta4kjizwkeeiscckygtwgq2qnkhtuofjnq`

## Development

Setup app, viewer
```shell
pnpm i
```

app
```shell
# dev
pnpm @app run dev
# deploy
pnpm @app run deploy
```

viewer
```shell
# dev
pnpm @viewer run dev:hydra
# build
pnpm @viewer run build:hydra
```

contract
```shell
cd contract
forge i

# test
forge test

# deploy
forge script script/CreativeCodingNFT.s.sol:DeployCreativeCodingNFT --rpc-url <RPC_URL> --broadcast
```