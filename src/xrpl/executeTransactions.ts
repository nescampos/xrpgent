import {Client, Wallet, xrpToDrops} from "xrpl";


export async function sendXRP(amount:string, to_address:string) {
    // Check if the mnemonic environment variable is set
    if (!process.env.WALLET_SECRETKEY) {
        throw new Error(
        "WALLET_SECRETKEY environment variable is not set. You need to set it to send a transaction"
        );
    }

    if (!process.env.XRPL_SERVER) {
        throw new Error(
          "XRPL_SERVER environment variable is not set. You need to set it to send a transaction"
        );
      }
  
    const server = new Client(process.env.XRPL_SERVER);
    const wallet = Wallet.fromSecret(process.env.WALLET_SECRETKEY);

    await server.connect();
    const prepared = await server.autofill({
        "TransactionType": "Payment",
        "Account": wallet.address,
        "Amount": xrpToDrops(Number(amount)),
        "Destination": to_address
      });
    const signed = wallet.sign(prepared);
    const tx = await server.submitAndWait(signed.tx_blob)
    await server.disconnect();
    return tx;
}

// export async function sendFungibleToken(tokenId:string, amount:string, to_address:string) {
//     // Check if the mnemonic environment variable is set
//     if (!process.env.WALLET_MNEMONIC) {
//         throw new Error(
//         "WALLET_MNEMONIC environment variable is not set. You need to set it to create a wallet client."
//         );
//     }
//     // Create a wallet from the mnemonic
//     const wallet = await generateWallet({
//         secretKey: process.env.WALLET_MNEMONIC,
//         password: '',
//     });
//     const tokenData = tokenId.split(".");
//     const address = privateKeyToAddress(wallet.accounts[0].stxPrivateKey, 'mainnet');
//     const decimalResult = await fetchCallReadOnlyFunction({
//         contractName: tokenData[1],
//         contractAddress: tokenData[0],
//         functionName: "get-decimals",
//         functionArgs:[],
//         senderAddress:address,
//         network:"mainnet"
//       });
//     const formattedAmount =  Number(amount) * 10**Number(decimalResult.value.value);
//     const postConditions = Pc.principal(address)
//         .willSendEq(formattedAmount)
//         .ft(tokenId, "sbtc-token");

//     const transaction = await makeContractCall({
//         contractName: tokenData[1],
//         contractAddress: tokenData[0],
//         functionName: "transfer",
//         functionArgs:[
//             Cl.uint(formattedAmount), // amount to transfer
//             Cl.principal(address), // sender address
//             Cl.principal(to_address), // recipient address
//             Cl.none()], // optional memo - passing none
//         senderKey: wallet.accounts[0].stxPrivateKey,
//         validateWithAbi: true,
//         network: "mainnet",
//         postConditions: [postConditions],
//         postConditionMode: PostConditionMode.Deny,
//       });
    

//     const tx_result = await broadcastTransaction({ transaction, network:"mainnet" });
//     return tx_result;
// }
