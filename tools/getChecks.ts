import { getChecks } from "../src/xrpl/manageChecks";
import type { ToolConfig } from "./allTools.js";

import type { GetBalanceArgs } from "../interface/index.js";

/**
 * Get the checks in a wallet.
 *
 * This tool takes a single parameter, the wallet address to get the checks
 * from.
 */
export const getChecksTool: ToolConfig<GetBalanceArgs> = {
  definition: {
    type: "function",
    function: {
      name: "get_checks",
      description: "Get the checks in a wallet",
      parameters: {
        type: "object",
        properties: {
          wallet: {
            type: "string",
            //pattern: "^0x[a-fA-F0-9]{40}$",
            description: "The wallet address to get the balance from",
          },
        },
        required: ["wallet"],
      },
    },
  },
  handler: async ({ wallet }) => {
    return await getChecksInWallet(wallet);
  },
};

async function getChecksInWallet(wallet: string) {
  const balance = await getChecks(wallet);
  return balance;
}
