import { z } from "zod"
import { } from "@medusajs/framework/types";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import getExchangeRatePriceWorkflow from "../../../../../workflows/get-exchange-rate-price-workflow";
import { PriceExchangeRateSchema, UpdatePriceSchema } from "./validators"
import { upsertVariantPricesWorkflow } from "@medusajs/medusa/core-flows";

type PriceExchangeRateSchemaType = z.infer<
  typeof PriceExchangeRateSchema
>

type UpdatePriceSchemaType = z.infer<
  typeof UpdatePriceSchema
>

export async function POST(
  req: MedusaRequest<PriceExchangeRateSchemaType>,
  res: MedusaResponse
) {

  const { result } = await getExchangeRatePriceWorkflow(req.scope).run({
    input: {
      amount: req.validatedBody.amount,
      currency: req.validatedBody.currency
    }
  })
  res.json(result);
}

export async function PUT(
  req: MedusaRequest<UpdatePriceSchemaType>,
  res: MedusaResponse
) {


  const previousVariantIds = req.validatedBody.data.map(v => v.variant_id);

  const { result } = await upsertVariantPricesWorkflow(req.scope).run({
    input: {
      variantPrices: req.validatedBody.data,
      previousVariantIds: previousVariantIds
    }
  })


  res.json(result);

}

