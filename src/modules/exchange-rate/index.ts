import ExchangeRateModuleService from "./services"
import { Module } from "@medusajs/framework/utils"

export const PRICEFX_MODULE = "pricefx_service"

export default Module(PRICEFX_MODULE, {
  service: ExchangeRateModuleService,
})


declare module "@medusajs/framework/types" {
  export interface ModuleImplementations {
    exchangeRateModuleService: ExchangeRateModuleService;
  }
}