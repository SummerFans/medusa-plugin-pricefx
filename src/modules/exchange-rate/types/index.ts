
export interface ExchangeRateOption {
  platform: PlatformType
  ttl: number; //default: 3600
  access_token: string;
}

export enum PlatformType {
  Frankfurter = 'frankfurter',
  ExchangeRate = 'exchange-rate',
  CurrencyLayer = 'currency-layer'
}

export interface ExchangeRatePlatform {
  name: string;
  fetchRate(sourceCurrency: string): Promise<FetchRateResponse>;
}

export interface CurrencyLayerResponse {
  success: boolean;
  terms: string;
  privacy: string;
  timestamp: number;
  source: string;
  quotes: {
    [key: string]: number;
  };
  error: { code: number; info: string }
}

export interface ExchangeRateResponse {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  conversion_rates: {
    [key: string]: number;
  };
}

export interface FrankfurterResponse {
  base: string;
  date: string;
  rates: {
    [key: string]: number;
  };
}

export interface FetchRateResponse {
  platform: string;
  currency: string;
  date: string;
  rates: {
    [key: string]: number;
  }
}
