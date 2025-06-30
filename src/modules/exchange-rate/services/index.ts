import { MedusaError, MedusaService } from "@medusajs/framework/utils";
import { Logger } from "@medusajs/medusa";
import { ExchangeRateOption, ExchangeRatePlatform, PlatformType } from "../types";
import CurrencyLayer from "./currency-layer";
import ExchangeRate from "./exchange-rate";
import Frankfurter from "./frankfurter";


type InjectedDependencies = {
  logger: Logger;
};

class ExchangeRateModuleService extends MedusaService({}) {

  public exchangeRate: ExchangeRatePlatform;
  public ttl;
  protected _logger: Logger;

  constructor({ logger }: InjectedDependencies, options: ExchangeRateOption) {
    super(...arguments)


    this.ttl = options.ttl || 3600;
    this._logger = logger;
    if(!options.platform) options.platform = PlatformType.Frankfurter;

    switch (options.platform) {
      case PlatformType.Frankfurter:
        this.exchangeRate = new Frankfurter(options, this._logger)
        break;
      case PlatformType.CurrencyLayer:
        if (!options.access_token) throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          'Required option `access_token` is missing in PriceFX plugin'
        );
        this.exchangeRate = new CurrencyLayer(options, this._logger)
        break
      case PlatformType.ExchangeRate:
        if (!options.access_token) throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          'Required option `access_token` is missing in PriceFX plugin');
        this.exchangeRate = new ExchangeRate(options, this._logger)
        break;
      default:
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `PriceFX does not support ${options.platform} services`);
    }

  }
}


export default ExchangeRateModuleService;