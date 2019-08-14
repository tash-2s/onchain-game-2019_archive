# Install
```
yarn install
curl https://raw.githubusercontent.com/loomnetwork/loom-sdk-documentation/master/scripts/get_loom.sh | sh
yarn loom init
yarn loom genkey -a public_key -k private_key
```

# Run
```
yarn loom run
yarn truffle migrate --network loom_local
```

# Test
```
yarn test # for truffle develop (fast)
# or
yarn test --network loom_local # for loom
```
