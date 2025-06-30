import { MedusaError, Modules } from "@medusajs/framework/utils";
import { createStep, createWorkflow, StepResponse, transform, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { EXCHANGE_RATE_BASE_CURRENCY_CACHE_NAME, getExchangeRateStep } from "./get-exchange-rate-workflow";


const zeroDecimalCurrencies = ['JPY', 'KRW', 'VND', 'IDR', 'COP', 'CLP', 'HUF', 'ISK', 'PYG', 'XAF', 'XOF', 'XPF'];

interface GetExchangeRatePriceStepInput {
  amount: number;
  currency: string;
}

export const getStoreCurrencies = createStep(
  'get-store-currencies',
  async (_, { container }) => {
    const storeModuleService = container.resolve(Modules.STORE)
    const cacheModuleService = container.resolve(Modules.CACHE)
    const stores = await storeModuleService.listStores()

    const baseCurrency = await cacheModuleService.get(EXCHANGE_RATE_BASE_CURRENCY_CACHE_NAME) || 'USD'

    if (stores.length > 0) {
      const store = await storeModuleService.retrieveStore(stores[0].id, {
        relations: ["supported_currencies.currency_code"],
      })
      const currencies = store?.supported_currencies?.map(sc => sc.currency_code.toUpperCase()).sort((a, b) => {
        if (a === baseCurrency) return -1;
        if (b === baseCurrency) return 1;
        return a.localeCompare(b);
      })
      return new StepResponse({ currencies })
    }



    throw new MedusaError(MedusaError.Types.INVALID_DATA, 'The store does not exist');

  }
)

const getExchangeRatePriceWorkflow = createWorkflow(
  'get-exchange-rate-price-workflow',
  (input: GetExchangeRatePriceStepInput) => {

    const { currencies } = getStoreCurrencies();

    const exchangeRate = getExchangeRateStep({ currency: input.currency });

    const newCurrencies = transform(({ currencies, exchangeRate, input }), (v) => {
      const newPrice = {};
      const rates = v.exchangeRate.rates;
      const baseAmount = v.input.amount;

      v.currencies?.map(c => {
        const convertedValue = baseAmount * rates[c];
        if (zeroDecimalCurrencies.includes(c)) {
          newPrice[c] = Math.round(convertedValue);
        } else {
          newPrice[c] = parseFloat(convertedValue.toFixed(2));
        }
      })

      newPrice[v.input.currency] = baseAmount;

      return newPrice
    })

    return new WorkflowResponse({ prices: newCurrencies });
  })

export default getExchangeRatePriceWorkflow;