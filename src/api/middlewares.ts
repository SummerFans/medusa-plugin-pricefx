import {
  defineMiddlewares,
  validateAndTransformBody,
} from "@medusajs/framework/http"
import { PriceExchangeRateSchema, UpdatePriceSchema } from './admin/plugin/pricefx/prices/validators';

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/plugin/pricefx/prices",
      method: "POST",
      middlewares: [
        validateAndTransformBody(PriceExchangeRateSchema),
      ],
    },
    {
      matcher: "/admin/plugin/pricefx/prices",
      method: "PUT",
      middlewares: [
        validateAndTransformBody(UpdatePriceSchema),
      ],
    },
  ],
})

