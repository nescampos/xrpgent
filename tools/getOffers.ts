import { getOffers } from "../src/xrpl/manageOffers";
import type { ToolConfig } from "./allTools.js";

import type { GetBalanceArgs } from "../interface/index.js";

/**
 * Get the offers in a wallet.
 *
 * This tool takes a single parameter, the wallet address to get the offers
 * from.
 */
export const getOffersTool: ToolConfig<GetBalanceArgs> = {
  definition: {
    type: "function",
    function: {
      name: "get_offers",
      description: "Get the offers in a wallet",
      parameters: {
        type: "object",
        properties: {
          wallet: {
            type: "string",
            //pattern: "^0x[a-fA-F0-9]{40}$",
            description: "The wallet address to get the offers from",
          },
        },
        required: ["wallet"],
      },
    },
  },
  handler: async ({ wallet }) => {
    return await getOffersInWallet(wallet);
  },
};

async function getOffersInWallet(wallet: string) {
  const balance = await getOffers(wallet);
  return balance;
}
