import { z } from "zod"

export const PriceExchangeRateSchema = z.object({
  amount: z.number(),
  currency: z.string(),
})

export const UpdatePriceSchema = z.object({
  data: z.object({
    product_id: z.string(),
    variant_id: z.string(),
    prices: z.object({
      amount: z.number(),
      currency_code: z.string(),
    }).array()
  }).array()

})