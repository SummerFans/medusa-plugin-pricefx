import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import getStoreCurrenciesWorkflow from "../../../../../workflows/get-store-currencies.workflow";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {

  const { result } = await getStoreCurrenciesWorkflow(req.scope).run({});

  res.json(result);

}
