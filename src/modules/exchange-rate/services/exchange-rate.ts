import { MedusaError } from '@medusajs/framework/utils';
import { ExchangeRateOption, ExchangeRatePlatform, ExchangeRateResponse, FetchRateResponse } from '../types'
import { Logger } from '@medusajs/medusa';

// https://v6.exchangerate-api.com/v6/YOUR-API-KEY/latest/USD
class ExchangeRate implements ExchangeRatePlatform {

  public name ;
  protected _apiUrl = 'https://v6.exchangerate-api.com';
  protected _accessToken;
  protected _logger: Logger;

  constructor({ platform, access_token }: ExchangeRateOption, logger: Logger) {
    this.name = platform
    this._accessToken = access_token
    this._logger = logger;

    this._logger.debug(`PriceFX plugin uses ${this.name} platform`)
  }

  async fetchRate(source: string): Promise<FetchRateResponse> {
    const res = await fetch(`${this._apiUrl}/v6/${this._accessToken}/latest/${source.toUpperCase()}`)

    if (res.status !== 200) {
      const data = await res.json();
      throw new MedusaError(MedusaError.Types.INVALID_DATA, data.message);
    }
    const data = await res.json() as ExchangeRateResponse;

    const d = new Date(data.time_last_update_unix * 1000);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');


    const result: FetchRateResponse = {
      platform: this.name,
      currency: data.base_code,
      date: `${year}-${month}-${day}`,
      rates: data.conversion_rates,
    }

    return result;
  }

}

export default ExchangeRate;