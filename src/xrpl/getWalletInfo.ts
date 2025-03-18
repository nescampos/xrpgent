import {Client, Wallet, AccountTxV1Response} from "xrpl";

/**
 * Get the address from the secret key in the environment file
 *
 *
 * @returns The XRPL address
 */
export async function getAddress() {
  // Check if the mnemonic environment variable is set
  if (!process.env.WALLET_SECRETKEY) {
    throw new Error(
      "WALLET_SECRETKEY environment variable is not set. You need to set it to create a wallet client."
    );
  }


  const wallet = Wallet.fromSecret(process.env.WALLET_SECRETKEY);


  return `Address: ${wallet.address}, Classic address: ${wallet.classicAddress}, Public key: ${wallet.publicKey}`;
}


/**
 * Get the native balance (XRP) from an address
 *
 *
 * @returns The XRP balance
 */
 export async function getNativeBalanceFromAddress(address:string) {
    // Check if the mnemonic environment variable is set
    if (!process.env.WALLET_SECRETKEY) {
      throw new Error(
        "WALLET_SECRETKEY environment variable is not set. You need to set it to create a wallet client."
      );
    }

    if (!process.env.XRPL_SERVER) {
      throw new Error(
        "XRPL_SERVER environment variable is not set. You need to set it to create a wallet client."
      );
    }

    const server = new Client(process.env.XRPL_SERVER);
    const wallet = Wallet.fromSecret(process.env.WALLET_SECRETKEY);

    await server.connect();
    const xrpBalance = await server.getXrpBalance(wallet.address);
    await server.disconnect();
    return xrpBalance;
}


/**
 * Get the token balances from an address
 *
 *
 * @returns The token balances
 */
 export async function getTokenBalancesFromAddress(address:string) {
    if (!process.env.WALLET_SECRETKEY) {
      throw new Error(
        "WALLET_SECRETKEY environment variable is not set. You need to set it to create a wallet client."
      );
    }

    if (!process.env.XRPL_SERVER) {
      throw new Error(
        "XRPL_SERVER environment variable is not set. You need to set it to create a wallet client."
      );
    }

    const server = new Client(process.env.XRPL_SERVER);
    const wallet = Wallet.fromSecret(process.env.WALLET_SECRETKEY);

    await server.connect();
    const tokenBalances = await server.getBalances(wallet.address);
    await server.disconnect();
    return tokenBalances.map((token) => `Currency: ${token.currency}, Amount: ${token.value}, Issuer: ${token.issuer}`).join("\n") ;
}



export async function getLast10Transactions(account: string) {
  if (!process.env.XRPL_SERVER) {
    throw new Error(
      "XRPL_SERVER environment variable is not set. You need to set it to create a wallet client."
    );
  }

  const client = new Client(process.env.XRPL_SERVER);
  await client.connect();

  const response = await client.request({
    command: "account_tx",
    account: account,
    ledger_index_min: -1,
    ledger_index_max: -1,
    limit: 10,
  }) as AccountTxV1Response;

  client.disconnect();

  return response.result.transactions.map((tx: any) => `Hash: ${tx.hash}, Ledger: ${tx.ledger_index}, Date: ${tx.close_time_iso}`).join("\n");
}

