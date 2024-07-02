# Nillion Operations and Blind Compute Demo with Keplr Wallet connection

This is a demo of the JavaScript Nillion Client working with payments connected to the testnet.

Notes

- This uses a proxy /nilchain-proxy set up in the webpack that targets the json rpc from your .env file
- A Nillion config is in the nillion.ts file. This config reads environment variables from your .env file, which can either point to Testnet or nillion-devnet values

## Run nillion-devnet

Install the `nightly-v2024-06-27-7db213f55` version of nillion-devnet to pull updated SDK tools including the latest nillion-devnet.

```
nilup install nightly-v2024-06-27-7db213f55
nilup use nightly-v2024-06-27-7db213f55
```

Run the devnet using any seed (the example uses "my-seed") so the cluster id, websockets, and other environment variables stay constant even when you restart nillion-devnet.

```shell
nillion-devnet --seed my-seed
```

You will see an output like this:

```
nillion-devnet --seed my-seed
ℹ️ cluster id is 222257f5-f3ce-4b80-bdbc-0a51f6050996
ℹ️ using 256 bit prime
ℹ️ storing state in /var/folders/1_/2yw8krkx5q5dn2jbhx69s4_r0000gn/T/.tmpU00Jbm (62.14Gbs available)
🏃 starting nilchain node in: /var/folders/1_/2yw8krkx5q5dn2jbhx69s4_r0000gn/T/.tmpU00Jbm/nillion-chain
⛓  nilchain JSON RPC available at http://127.0.0.1:48102
⛓  nilchain gRPC available at localhost:26649
🏃 starting node 12D3KooWMGxv3uv4QrGFF7bbzxmTJThbtiZkHXAgo3nVrMutz6QN
⏳ waiting until bootnode is up...
🏃 starting node 12D3KooWKkbCcG2ujvJhHe5AiXznS9iFmzzy1jRgUTJEhk4vjF7q
🏃 starting node 12D3KooWMgLTrRAtP9HcUYTtsZNf27z5uKt3xJKXsSS2ohhPGnAm
👛 funding nilchain keys
📝 nillion CLI configuration written to /Users/steph/Library/Application Support/nillion.nillion/config.yaml
🌄 environment file written to /Users/steph/Library/Application Support/nillion.nillion/nillion-devnet.env
```

Copy the path printed after "🌄 environment file written to" and open the file

```
vim "/Users/steph/Library/Application Support/nillion.nillion/nillion-devnet.env"
```

This file has the nillion-devnet generated values for cluster id, websocket, json rpc, and private key. You'll need to put these in your local .env in one of the next steps so that your cra-nillion demo app connects to the nillion-devnet.

## Clone this repo

```
git clone https://github.com/NillionNetwork/cra-nillion.git
cd cra-nillion
```

Copy the up the .env.example file to a new .env and set up these variables to match the nillion environment file

```shell
cp .env.example .env
```

Update your newly created .env with environment variables outout in your terminal by nillion-devnet

```
# replace with values from nillion-testnet

REACT_APP_NILLION_CLUSTER_ID=
REACT_APP_NILLION_BOOTNODE_WEBSOCKET=
REACT_APP_NILLION_NILCHAIN_JSON_RPC=
REACT_APP_NILLION_NILCHAIN_REST_API=
REACT_APP_NILLION_NILCHAIN_CHAIN_ID=nillion-chain-testnet-1

REACT_APP_NILLION_NILCHAIN_PRIVATE_KEY=
REACT_APP_API_BASE_PATH=/nilchain-proxy
```

Install dependencies and start the demo project. Notice that a local nillion_js_client.tgz is installed rather than a version of the JavaScript Client from npm. This version includes payments.

```shell
npm install
npm start
```

## Check out the demos

- Open http://localhost:8080 to see the "Nillion Operations" page where you can connect with different user key and node keys, store secrets, update secrets, retrieve secrets, and store programs
- Open http://localhost:8080/compute to see the "Nillion Blind Computation Demo" page where you can run a full blind computation flow.
