import { createAMM } from "../src/xrpl/manageAMM";
import type { ToolConfig } from "./allTools.js"; // Type definition for tool configurations
import type { CreateAMMArgs } from "../interface/index.js"; // Type definition for send transaction arguments

// Configuration for the send transaction tool
export const createAMMTool: ToolConfig<CreateAMMArgs> = {
  definition: {
    type: "function",
    function: {
      name: "create_amm",
      description: "Create an AMM (Automated Market Maker)",
      parameters: {
        type: "object",
        properties: {
          amount_from: {
          type: "string",
          description: "The amount of the first currency in the AMM",
        },
        amount_to: {
          type: "string",
          description: "The amount of the second currency in the AMM",
        },
        
        token_from: {
          type: "string",
          description: "The token to use (if is not XRP) for the first currency",
          optional: true,
        },
        token_to: {
          type: "string",
          description: "The token to use (if is not XRP) for the second currency",
          optional: true,
        },
        tradingfee: {
          type: "string",
          description: "The trading fee (in percentage)",
          optional: true,
        },
      },
      required: ["amount_from","amount_to"],
      },
    },
  },
  // Handler function to execute the send transaction tool
  handler: async (amm) => {
    const result = await createAMM(amm.amount_from, amm.amount_to, amm.token_from, amm.token_to, amm.tradingfee);
    return result;
  },
};

