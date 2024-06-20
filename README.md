# Nillion Operations and Blind Compute Demo

This is a demo of the JavaScript Nillion Client working with payments.

Video setup guide: https://www.loom.com/share/c4196fca27474c2c8567a3a87e036217?sid=c73f751b-465b-433a-ae0f-976616d8935e

## Run nillion-devnet

Install the very latest version of nillion-devnet. Run the devnet

```shell
nillion-devnet
```

You will see an output like this:

```
nillion-devnet --seed scaffold-nillion
ℹ️ cluster id is 18d71351-b5d9-4d8d-bbcd-cdcc615badab
ℹ️ using 256 bit prime
ℹ️ storing state in /var/folders/1_/2yw8krkx5q5dn2jbhx69s4_r0000gn/T/.tmpOUWo45 (68.73Gbs available)
🏃 starting nilchain node in: /var/folders/1_/2yw8krkx5q5dn2jbhx69s4_r0000gn/T/.tmpOUWo45/nillion-chain
⛓  nilchain JSON RPC available at http://127.0.0.1:48102
⛓  nilchain gRPC available at localhost:26649
🏃 starting node 12D3KooWNQTeFoEFHLp46RVG3ydUSZ9neeoAL44DSRYjExWLsRQ4
⏳ waiting until bootnode is up...
🏃 starting node 12D3KooWGVUmVWzYBPhm1fKKPYiV2gxj51o37pdVuGjVhdWWTWR1
🏃 starting node 12D3KooWCncgNnNebnL8FQB49GdK18aVNi7oDr5ooyAc59QaFseZ
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
# replace with values from nillion-devnet

REACT_APP_NILLION_CLUSTER_ID=
REACT_APP_NILLION_BOOTNODE_WEBSOCKET=
REACT_APP_NILLION_NILCHAIN_JSON_RPC=
REACT_APP_NILLION_NILCHAIN_PRIVATE_KEY=
```

Install dependencies and start the demo project. Notice that a local nillion_js_client.tgz is installed rather than a version of the JavaScript Client from npm. This version includes payments.

```shell
npm install
npm start
```

## Check out the demos

- Open http://localhost:8080 to see the "Nillion Operations" page where you can connect with different user key and node keys, store secrets, update secrets, retrieve secrets, and store programs
- Open http://localhost:8080/compute to see the "Nillion Blind Computation Demo" page where you can run a full blind computation flow.
