import type { ToolConfig } from "./allTools.js"; // Type definition for tool configurations
import type { CreateOfferArgs } from "../interface/index.js"; // Type definition for send transaction arguments
import { sendOffer } from "../src/xrpl/manageOffers";

// Configuration for the send transaction tool
export const createOfferTool: ToolConfig<CreateOfferArgs> = {
  definition: {
    type: "function",
    function: {
      name: "create_offer",
      description: "Create a new offer between 2 tokens/coins",
      parameters: {
        type: "object",
        properties: {
            amount_from: {
            type: "string",
            description: "The amount to send in the offer",
          },
          amount_to: {
            type: "string",
            description: "The amount to receive in the offer",
          },
          
          token_from: {
            type: "string",
            description: "The token to use (if is not XRP) to send",
            optional: true,
          },
          token_to: {
            type: "string",
            description: "The token to use (if is not XRP) to receive",
            optional: true,
          },
        },
        required: ["amount_from","amount_to"],
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
    amount_from,
    amount_to,
    token_from,
    token_to
}: CreateOfferArgs) {
  try {
    const result = await sendOffer(amount_from, amount_to, token_from, token_to);
    
    return result;
    
    
  } catch (error) {
    // Handling errors and returning an error message
    //console.error(error);
    return "Failed to send the offer";
  }
}
