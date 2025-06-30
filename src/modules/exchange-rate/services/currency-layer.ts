import { MedusaError } from '@medusajs/framework/utils';
import { CurrencyLayerResponse, ExchangeRateOption, ExchangeRatePlatform, FetchRateResponse } from '../types'
import { Logger } from '@medusajs/medusa';

// https://api.currencylayer.com/live?access_key={token}&source=USD
class CurrencyLayer implements ExchangeRatePlatform {

  public name = 'currency-layer';
  protected _apiUrl = 'https://api.currencylayer.com';
  protected _accessToken;
  protected _logger: Logger;

  constructor({ platform, access_token }: ExchangeRateOption, logger: Logger) {
    this.name = platform
    this._accessToken = access_token
    this._logger = logger;

    this._logger.debug(`PriceFX plugin uses ${this.name} platform`)
  }

  async fetchRate(source: string): Promise<FetchRateResponse> {

    const res = await fetch(`${this._apiUrl}/live?access_key=${this._accessToken}&source=${source.toUpperCase()}`)

    const data = await res.json() as CurrencyLayerResponse;
    if (!data.success) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, data.error.info);
    }

    const rates = Object.entries(data.quotes).reduce((acc, [key, value]) => {
      acc[key.replace(data.source, '')] = value;
      return acc;
    }, {});

    const d = new Date(data.timestamp * 1000);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    const result: FetchRateResponse = {
      platform: this.name,
      currency: data.source,
      date: `${year}-${month}-${day}`,
      rates
    }

    return result;
  }

}

export default CurrencyLayer;