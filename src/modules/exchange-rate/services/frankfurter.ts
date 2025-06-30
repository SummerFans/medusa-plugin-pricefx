import { MedusaError } from '@medusajs/framework/utils';
import { ExchangeRateOption, ExchangeRatePlatform, FetchRateResponse, FrankfurterResponse } from '../types'
import { Logger } from '@medusajs/medusa';

// https://api.frankfurter.dev/v1/latest?base=USD
class Frankfurter implements ExchangeRatePlatform {

  public name;
  protected _apiUrl = 'https://api.frankfurter.dev';
  protected _logger: Logger;

  constructor({ platform }: ExchangeRateOption, logger: Logger) {
    this.name = platform
    this._logger = logger;

    this._logger.debug(`PriceFX plugin uses ${this.name} platform`)
  }

  async fetchRate(source: string): Promise<FetchRateResponse> {
    const res = await fetch(`${this._apiUrl}/v1/latest?base=${source}`)

    if (res.status !== 200) {
      const data = await res.json();
      throw new MedusaError(MedusaError.Types.INVALID_DATA, data.message);
    }
    const data = await res.json() as FrankfurterResponse;

    const result: FetchRateResponse = {
      platform: this.name,
      currency: data.base,
      date: data.date,
      rates: data.rates
    };

    return result;
  }

}

export default Frankfurter;