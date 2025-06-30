import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { getStoreCurrencies } from "./get-exchange-rate-price-workflow";

const getStoreCurrenciesWorkflow = createWorkflow(
  'get-store-currencies-workflow',
  () => {

    const { currencies } = getStoreCurrencies();

    return new WorkflowResponse({ currencies })

  }
)

export default getStoreCurrenciesWorkflow;