import {Client, Wallet, Amount, CheckCreate, CheckCancel, CheckCash} from "xrpl";


export async function sendCheck(amount:string, to_address:string, token?: string) {
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

    let amountCalculated : Amount = amount;
    if(token != undefined && token != "" && token != "XRP") {
      amountCalculated = {
        "currency": token,
        "value": amount,
        "issuer": wallet.address  	
      } as Amount
    }

    await server.connect();

    const send_check_tx = {
      "TransactionType": "CheckCreate",
      "Account": wallet.address,
      "SendMax": amountCalculated,
      "Destination": to_address
    } as CheckCreate;

    const check_prepared = await server.autofill(send_check_tx);
    const check_signed = wallet.sign(check_prepared);
    const check_result = await server.submitAndWait(check_signed.tx_blob)

    await server.disconnect();
    
    if(check_result.result.meta.TransactionResult == "tesSUCCESS") {
      return `Success, tx hash: ${check_result.result.hash}`
    } else {
      return 'Error sending transaction';
    }
}

export async function getChecks(address:string) {
  if (!process.env.XRPL_SERVER) {
    throw new Error(
      "XRPL_SERVER environment variable is not set. You need to set it to send a transaction"
    );
  }
  const server = new Client(process.env.XRPL_SERVER);

  await server.connect();


  const check_objects = await server.request({
    "id": 5,
    "command": "account_objects",
    "account": address,
    "ledger_index": "validated",
    "type": "check"
  });


  if(check_objects.result.account_objects.length == 0) {
    return "There is no checks in your account";
  }

  const results = check_objects.result.account_objects.map((checks) => `From: ${checks.Account}, To: ${checks.Destination}, Amount: ${checks.SendMax}`)
  
  await server.disconnect();
  return results.join("\n");
}


export async function cancelCheck(checkId:string) {
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

  const cancel_check_tx = {
    "TransactionType": "CheckCancel",
    "Account": wallet.address,
    "CheckID": checkId
  } as CheckCancel;


  const cancel_prepared = await server.autofill(cancel_check_tx)
  const cancel_signed = wallet.sign(cancel_prepared);
  const check_result = await server.submitAndWait(cancel_signed.tx_blob);

  await server.disconnect();
  if(check_result.result.meta.TransactionResult == "tesSUCCESS") {
    return `Success, tx hash: ${check_result.result.hash}`
  } else {
    return 'Error sending transaction';
  }
}

export async function cashCheck(checkId:string) {
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

  const cancel_check_tx = {
    "TransactionType": "CheckCash",
    "Account": wallet.address,
    "CheckID": checkId
  } as CheckCash;


  const cancel_prepared = await server.autofill(cancel_check_tx)
  const cancel_signed = wallet.sign(cancel_prepared);
  const check_result = await server.submitAndWait(cancel_signed.tx_blob);

  await server.disconnect();
  if(check_result.result.meta.TransactionResult == "tesSUCCESS") {
    return `Success, tx hash: ${check_result.result.hash}`
  } else {
    return 'Error sending transaction';
  }
}