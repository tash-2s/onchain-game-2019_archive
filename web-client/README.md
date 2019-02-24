# Install
```
yarn install
```

# Run
## Testnet (extdev_plasma_us1)
```
yarn generate-contracts-types
yarn serve:extdev_plasma_us1
```

## Local
Make sure k2-loomchain is running on your local.
```
yarn generate-chain-env local
yarn generate-contracts-types
yarn serve:local
```
