import {Client, Wallet, xrpToDrops, Payment, TrustSet} from "xrpl";


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

export async function sendFungibleToken(tokenId:string, amount:string, to_address:string) {
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

    const trustSet_tx = {
      "TransactionType": "TrustSet",
      "Account": to_address,
      "LimitAmount": {
        "currency": tokenId,
        "issuer": wallet.address,
        "value": amount
      } 
    } as TrustSet;

    const ts_prepared = await server.autofill(trustSet_tx);
    const ts_signed = wallet.sign(ts_prepared);
    const ts_result = await server.submitAndWait(ts_signed.tx_blob)

    const send_token_tx = {
      "TransactionType": "Payment",
      "Account": wallet.address,
      "Amount": {
        "currency": tokenId,
        "value": amount,
        "issuer": wallet.address
      },
      "Destination": to_address
    } as Payment;

    const pay_prepared = await server.autofill(send_token_tx)

    const signed = wallet.sign(pay_prepared);
    const tx = await server.submitAndWait(signed.tx_blob)
    await server.disconnect();
    return tx;
}
