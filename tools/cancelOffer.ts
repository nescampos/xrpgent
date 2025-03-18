import { cancelOffer } from "../src/xrpl/manageOffers";
import type { ToolConfig } from "./allTools.js"; // Type definition for tool configurations
import type { CancelOfferArgs } from "../interface/index.js"; // Type definition for send transaction arguments

// Configuration for the send transaction tool
export const cancelOfferTool: ToolConfig<CancelOfferArgs> = {
  definition: {
    type: "function",
    function: {
      name: "cancel_offer",
      description: "Cancel an offer",
      parameters: {
        type: "object",
        properties: {
          sequenceId: {
            type: "string",
            description: "The sequence id of the offer to cancel",
          },
        },
        required: ["sequenceId"],
      },
    },
  },
  // Handler function to execute the send transaction tool
  handler: async (sequence) => {
    const result = await cancelOffer(sequence.sequenceId);
    return result;
  },
};

