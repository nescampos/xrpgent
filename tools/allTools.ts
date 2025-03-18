import { getWalletAddressTool } from "./getWalletAddress";
import { getBalanceTool } from "./getBalance";
import { getTokenBalancesTool } from "./getTokenBalances";
import { sendTransactionTool } from "./sendTransaction";
import { createCheckTool } from "./createCheck";
import { getChecksTool } from "./getChecks";
import { cancelCheckTool } from "./cancelCheck";
import { getTransactionsTool } from "./getTransactions";
import { createOfferTool } from "./createOffer";
import { getOffersTool } from "./getOffers";
import { cancelOfferTool } from "./cancelOffer";

export interface ToolConfig<T = any> {
  /**
   * The definition of the tool.
   */
  definition: {
    type: "function";
    function: {
      name: string;
      description: string;
      parameters: {
        type: "object";
        properties: Record<string, unknown>;
        required: string[];
      };
    };
  };

  /**
   * The handler function that will be called when the tool is executed.
   */
  handler: (args: T) => Promise<any>;
}

export const tools: Record<string, ToolConfig> = {
  // == READ == \\
  /**
   * Get the connected wallet address.
   */
  get_wallet_address: getWalletAddressTool,
  /**
   * Get the balance of a wallet address.
   */
   get_balance: getBalanceTool,
  /**
   * Get the token balances of a wallet address.
   */
   get_token_balances: getTokenBalancesTool,
  /**
   * Get the checks of a wallet address.
   */
   get_checks: getChecksTool,
  /**
   * Get the last transactions of a wallet address.
   */
   get_transactions: getTransactionsTool,
  /**
   * Get the offers of a wallet address.
   */
   get_offers: getOffersTool,


  /**
   * Send a transaction to another address 
   */
   send_transaction: sendTransactionTool,
  /**
   * Create and send a new check
   */
   send_check: createCheckTool,
  /**
   * Cancel a check
   */
   cancel_check: cancelCheckTool,
  /**
   * Create an offer
   */
   create_offer: createOfferTool,
  /**
   * Cancel an offer
   */
   cancel_offer: cancelOfferTool,
};
