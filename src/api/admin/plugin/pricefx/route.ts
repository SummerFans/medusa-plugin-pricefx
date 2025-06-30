import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { MedusaError, Modules } from "@medusajs/framework/utils";
import getExchangeRateWorkflow, { EXCHANGE_RATE_BASE_CURRENCY_CACHE_NAME } from "../../../../workflows/get-exchange-rate-workflow";

export async function POST(
  req: MedusaRequest<{ currency: string }>,
  res: MedusaResponse
) {

  const currency = req.body.currency;

  if (!currency) throw new MedusaError(MedusaError.Types.INVALID_DATA, 'requires currency parameter')

  const cacheModuleService = req.scope.resolve(Modules.CACHE);

  cacheModuleService.set(EXCHANGE_RATE_BASE_CURRENCY_CACHE_NAME, currency.toUpperCase());
  return res.json({ success: true })
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { result } = await getExchangeRateWorkflow(req.scope).run({})

  res.json(result);

}
