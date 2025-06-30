import { createStep, createWorkflow, StepResponse, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { PRICEFX_MODULE } from "../modules/exchange-rate";
import ExchangeRateModuleService from "../modules/exchange-rate/services";
import { ContainerRegistrationKeys, MedusaError, Modules } from "@medusajs/framework/utils";
import { FetchRateResponse } from "../modules/exchange-rate/types";

const EXCHANGE_RATE_CACHE_NAME = 'exchange-rate-cache';
export const EXCHANGE_RATE_BASE_CURRENCY_CACHE_NAME = 'exchange-rate-base-currency-cache';

export const getExchangeRateStep = createStep(
  'get-exchange-rate-step',
  async ({ currency }: { currency?: string }, { container }) => {

    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const cacheModuleService = container.resolve(Modules.CACHE);

    let baseCurrency = await cacheModuleService.get(EXCHANGE_RATE_BASE_CURRENCY_CACHE_NAME) as string;

    if (!baseCurrency && !currency) {
      baseCurrency = 'USD'
    } else if (currency) {
      baseCurrency = currency
    }

    const exchangeRateModuleService: ExchangeRateModuleService = container.resolve(PRICEFX_MODULE)

    const exchangeRateCache = await cacheModuleService.get(EXCHANGE_RATE_CACHE_NAME) as string;


    if (exchangeRateCache) {
      logger.debug("cache");
      try {
        const exchangeRateCacheObj = JSON.parse(exchangeRateCache) as FetchRateResponse;

        if (exchangeRateCacheObj.currency == baseCurrency) {
          return new StepResponse(exchangeRateCacheObj);
        }
      } catch (e) {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, e.message);
      }
    }

    const result = await exchangeRateModuleService.exchangeRate.fetchRate(baseCurrency)

    if (exchangeRateModuleService.ttl > 0) {
      cacheModuleService.set(EXCHANGE_RATE_CACHE_NAME, JSON.stringify(result), exchangeRateModuleService.ttl)
    }

    return new StepResponse(result);
  }
)

const getExchangeRateWorkflow = createWorkflow(
  'get-exchange-rate-workflow',
  () => {
    return new WorkflowResponse(getExchangeRateStep({}))

  }
)

export default getExchangeRateWorkflow;