import {Client, Wallet, Amount, xrpToDrops, dropsToXrp, IssuedCurrencyAmount} from "xrpl";


export async function sendOffer(amount_from:string,amount_to:string,token_from?:string, token_to?: string) {
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

    let takerGets : Amount = xrpToDrops(Number(amount_from));
    if(token_from != undefined && token_from != "" && token_from != "XRP") {
        takerGets = {
          "currency": token_from,
          "value": amount_from,
          "issuer": wallet.address  	
        };
      }
    
    
    let takerPays : Amount = xrpToDrops(Number(amount_to));
    if(token_to != undefined && token_to != "" && token_to != "XRP") {
        takerPays = {
          "currency": token_to,
          "value": amount_to,
          "issuer": wallet.address  	
        };
      }

    const prepared = await server.autofill({
        "TransactionType": "OfferCreate",
        "Account": wallet.address,
        "TakerGets": takerGets,
        "TakerPays": takerPays
      });  
    const signed = wallet.sign(prepared);
    const tx = await server.submitAndWait(signed.tx_blob)

    await server.disconnect();
    
    if(tx.result.meta.TransactionResult == "tesSUCCESS") {
      return `Success, tx hash: ${tx.result.hash}`
    } else {
      return 'Error sending transaction';
    }
}


export async function getOffers(address:string) {
  if (!process.env.XRPL_SERVER) {
    throw new Error(
      "XRPL_SERVER environment variable is not set. You need to set it to send a transaction"
    );
  }
  const server = new Client(process.env.XRPL_SERVER);

  await server.connect();


  const offers = await server.request({
    "id": 5,
    "command": "account_offers",
    "account": address,
    "ledger_index": "validated",
  });


  if(offers.result.offers == undefined || offers.result.offers.length == 0) {
    return "There is no offers in your account";
  }

  const results = offers.result.offers.map((offer) => `Taker gets: ${parseAmount(offer.taker_gets)}, Taker pays: ${parseAmount(offer.taker_pays)}, Sequence Id: ${offer.seq}`)
  
  await server.disconnect();
  return results.join("\n");
}

export async function cancelOffer(sequenceId:string) {
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
    "TransactionType": "OfferCancel",
    "Account": wallet.address,
    "OfferSequence": parseInt(sequenceId)
  })


  const signed = wallet.sign(prepared);
  const tx = await server.submitAndWait(signed.tx_blob)

  await server.disconnect();
  if(tx.result.meta.TransactionResult == "tesSUCCESS") {
    return `Success, tx hash: ${tx.result.hash}`
  } else {
    return 'Error sending transaction';
  }
}

function parseAmount(amount:Amount)
{
   if(typeof amount === "string") {
    return `${dropsToXrp(amount)} XRP`
   } else
   {
    return `${amount.value} ${amount.currency}`
   }
}