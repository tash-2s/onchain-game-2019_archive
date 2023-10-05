# Install
```
curl https://raw.githubusercontent.com/loomnetwork/loom-sdk-documentation/master/scripts/get_loom.sh | sh
yarn loom init
yarn loom genkey -a local_public_key -k local_private_key
rm local_public_key # public_key is gettable from private_key
```

# Run
```
yarn loom run
yarn truffle migrate --network local
```

# Test
```
yarn test # for truffle develop (fast)
# or
yarn test --network local # for loom
```
