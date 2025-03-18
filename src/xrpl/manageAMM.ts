import {Client, Wallet, Amount, xrpToDrops, dropsToXrp, AMMInfoRequest} from "xrpl";


export async function createAMM(amount_1:string,amount_2:string,token_1?:string, token_2?: string, tradingfee?:string) {
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

    const ss = await server.request({"command": "server_state"});
    const amm_fee_drops = ss.result.state.validated_ledger.reserve_inc.toString();


    let amount1 : Amount = xrpToDrops(Number(amount_1));
    if(token_1 != undefined && token_1 != "" && token_1 != "XRP") {
      amount1 = {
          "currency": token_1,
          "value": amount_1,
          "issuer": wallet.address  	
        };
      }
    
    
    let amount2 : Amount = xrpToDrops(Number(amount_2));
    if(token_2 != undefined && token_2 != "" && token_2 != "XRP") {
      amount2 = {
          "currency": token_2,
          "value": amount_2,
          "issuer": wallet.address  	
        };
      }

    const prepared_create = await server.autofill({
      "TransactionType": "AMMCreate",
      "Account": wallet.address,
      "Amount": amount1,
      "Amount2": amount2,
      "TradingFee": Number(tradingfee??1) * 100,
      "Fee": amm_fee_drops
    });
    const signed_create = wallet.sign(prepared_create)
    const tx = await server.submitAndWait(signed_create.tx_blob)

    await server.disconnect();
    
    if(tx.result.meta.TransactionResult == "tesSUCCESS") {
      return `Success, tx hash: ${tx.result.hash}`
    } else {
      return 'Error sending transaction';
    }
}


export async function getAMMs(token_1:string, token_2: string) {
  if (!process.env.XRPL_SERVER) {
    throw new Error(
      "XRPL_SERVER environment variable is not set. You need to set it to send a transaction"
    );
  }
  if (!process.env.WALLET_SECRETKEY) {
    throw new Error(
    "WALLET_SECRETKEY environment variable is not set. You need to set it to send a transaction"
    );
}

  const wallet = Wallet.fromSecret(process.env.WALLET_SECRETKEY);

  const server = new Client(process.env.XRPL_SERVER);

  await server.connect();

  let amount1 : any = "XRP";

  if(token_1 != undefined && token_1 != "" && token_1 != "XRP") {
    amount1 = {
        "currency": token_1,
        "issuer": wallet.address  	
      };
    }
  
  
    let amount2 : any = "XRP";

    if(token_2 != undefined && token_2 != "" && token_2 != "XRP") {
      amount2 = {
          "currency": token_2,
          "issuer": wallet.address  	
        };
      }

  const amm_info_request = {
    "command": "amm_info",
    "asset": amount1,
    "asset2": amount2,
    "ledger_index": "validated"
  } as AMMInfoRequest;

  const amm_info_result = await server.request(amm_info_request)



  if(amm_info_result.result.amm == undefined || amm_info_result.result == null) {
    return "There is no AMMs in your account";
  }

  const results = `LP token: ${parseAmount(amm_info_result.result.amm.lp_token)}, First currency: ${parseAmount(amm_info_result.result.amm.amount)}, Second currency: ${parseAmount(amm_info_result.result.amm.amount2)}, Trading fee (%): ${amm_info_result.result.amm.trading_fee / 100}`;
  
  await server.disconnect();
  return results;
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