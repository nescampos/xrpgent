import { sendCheck } from "../src/xrpl/manageChecks";
import type { ToolConfig } from "./allTools.js"; // Type definition for tool configurations
import type { SendTransactionArgs } from "../interface/index.js"; // Type definition for send transaction arguments

// Configuration for the send transaction tool
export const createCheckTool: ToolConfig<SendTransactionArgs> = {
  definition: {
    type: "function",
    function: {
      name: "send_check",
      description: "Send a check to another address",
      parameters: {
        type: "object",
        properties: {
          to: {
            type: "string",
            description: "The recipient address",
          },
          value: {
            type: "string",
            description: "The amount of XRP to send",
          },
          
          token: {
            type: "string",
            description: "The token Id of the token/coin to send",
            optional: true,
          },
        },
        required: ["to","value"],
      },
    },
  },
  // Handler function to execute the send transaction tool
  handler: async (args) => {
    const result = await sendTransaction(args);
    return result;
  },
};

// Function to send a transaction
async function sendTransaction({
  to,
  value,
  token
}: SendTransactionArgs) {
  try {
    const result = await sendCheck(value, to, token);
    
    return result;
    
    
  } catch (error) {
    // Handling errors and returning an error message
    //console.error(error);
    return "Failed to send the check";
  }
}
