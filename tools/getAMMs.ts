import { getAMMs } from "../src/xrpl/manageAMM";
import type { ToolConfig } from "./allTools.js";

import type { GetAMMArgs } from "../interface/index.js";

/**
 * Get the AMMs in a wallet.
 *
 * This tool takes a single parameter, the wallet address to get the AMMs
 * from.
 */
export const getAMMsTool: ToolConfig<GetAMMArgs> = {
  definition: {
    type: "function",
    function: {
      name: "get_amms",
      description: "Get the AMMs in a wallet",
      parameters: {
        type: "object",
        properties: {
          token_from: {
            type: "string",
            //pattern: "^0x[a-fA-F0-9]{40}$",
            description: "The wallet address to get the offers from",
          },
          token_to: {
            type: "string",
            //pattern: "^0x[a-fA-F0-9]{40}$",
            description: "The wallet address to get the offers from",
          },
        },
        required: ["token_from","token_to"],
      },
    },
  },
  handler: async ({ token_from, token_to }) => {
    return await getAMMsInWallet(token_from, token_to);
  },
};

async function getAMMsInWallet(token_from:string, token_to:string) {
  const balance = await getAMMs(token_from, token_to);
  return balance;
}
