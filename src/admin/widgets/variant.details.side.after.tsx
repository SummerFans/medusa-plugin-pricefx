import { defineWidgetConfig } from '@medusajs/admin-sdk';
import { Container, CurrencyInput, Heading, IconButton, Select, toast } from '@medusajs/ui'
import { WandSparkle } from '@medusajs/icons';
import { useEffect, useState } from 'react';
import PriceTable from '../components/price-table';

declare const __BACKEND_URL__: string;

const VariantAutomaticPriceConversionWidget = ({ data }: any) => {

  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<string>();
  const [currencies, setCurrencies] = useState([]);
  const [currency, setCurrency] = useState<string | null>(null);

  const [prices, setPrices] = useState<any[] | null>(data.prices);

  const changeCurrencyHandle = async (value: string) => {
    setLoading(true);
    const res = await fetch(`${__BACKEND_URL__||''}/admin/plugin/pricefx`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ currency: value })
    })
    setLoading(false);
    if (res.status !== 200) {
      const data = await res.json();
      toast.error(data.message);
    }
    setCurrency(value)
  }

  const getPricesHandle = async () => {
    setLoading(true);
    setPrices(null);
    const amountNum = parseFloat(amount as string);

    const res = await fetch(`${__BACKEND_URL__||''}/admin/plugin/pricefx/prices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: amountNum,
        currency,
      })
    });
    setLoading(false);
    const { prices } = await res.json();

    data.prices.map((v: any) => {
      Object.keys(prices).map(k => {
        if (v.currency_code.toUpperCase() == k) {
          v.amount = prices[k];
        }
      })
    })
    setPrices(data.prices)
  }

  useEffect(() => {
    const getCurrencies = async () => {
      const res = await fetch(`${__BACKEND_URL__||''}/admin/plugin/pricefx/currencies`);
      const { currencies } = await res.json();
      setCurrencies(currencies)
      setCurrency(currencies[0])
    }
    getCurrencies();
  }, [prices])

  return (
    <Container>

      <div className='flex items-center justify-between py-2'>
        <Heading level='h2' className='mb-2'>Automatic price conversion</Heading>
      </div>
      <div className='flex w-full flex-col gap-2'>
        <div className='flex gap-2'>

          <div className='flex-1'>
            {currency && <CurrencyInput disabled={loading} formatValueOnBlur onValueChange={(v) => setAmount(v)} symbol='' code={currency} />}
          </div>
          <div className='flex-none w-[100px]'>
            {currency && (
              <Select disabled={loading} defaultValue={currency} onValueChange={changeCurrencyHandle}>
                <Select.Trigger>
                  <Select.Value placeholder="Currency" />
                </Select.Trigger>
                <Select.Content>
                  {currencies.map((item) => (
                    <Select.Item key={item} value={item}>
                      {item}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>)}
          </div>
          <div className='flex-none w-[40px]'>
            <IconButton disabled={loading} onClick={getPricesHandle}>
              <WandSparkle />
            </IconButton>
          </div>
        </div>

        <div className='py-2 mt-2 overflow-hidden rounded-lg'>
          <PriceTable prices={prices} product_id={data.product_id} variant_id={data.id} />
        </div>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product_variant.details.side.before"
})

export default VariantAutomaticPriceConversionWidget;