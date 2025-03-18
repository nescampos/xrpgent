import { cashCheck } from "../src/xrpl/manageChecks";
import type { ToolConfig } from "./allTools.js"; // Type definition for tool configurations
import type { CancelCheckArgs } from "../interface/index.js"; // Type definition for send transaction arguments

// Configuration for the send transaction tool
export const cashCheckTool: ToolConfig<CancelCheckArgs> = {
  definition: {
    type: "function",
    function: {
      name: "cash_check",
      description: "Cash a check",
      parameters: {
        type: "object",
        properties: {
          checkId: {
            type: "string",
            description: "The id of the check to cash",
          },
        },
        required: ["checkId"],
      },
    },
  },
  // Handler function to execute the send transaction tool
  handler: async (checkId) => {
    const result = await cashCheck(checkId.checkId);
    return result;
  },
};

