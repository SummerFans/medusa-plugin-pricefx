import { Button, CurrencyInput, Table, Text, usePrompt, toast } from "@medusajs/ui";

interface PriceTableProps {
  prices: any[] | null;
  product_id: string,
  variant_id: string;
}

export default function PriceTable({ prices, variant_id, product_id }: PriceTableProps) {

  const dialog = usePrompt()

  const updateAmount = ({ amount, id }: any) => {
    prices?.map(price => price.id == id ? price.amount = parseFloat(amount) : '')
  }

  const updatePrice = async () => {
    const confirm = await dialog({
      title: "Confirm Update",
      description: "Do you confirm updating the product price?"
    })

    if (confirm) {
      const _prices = prices?.map(({ currency_code, amount }: any) => {
        return {
          amount,
          currency_code
        }
      })

      const res = await fetch('/admin/plugin/pricefx/prices', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ data: [{ product_id, variant_id, prices: _prices }] })
      });

      if (res.status != 200) {
        const d = await res.json();
        toast.error(d.message);
        return 
      }


      toast.success('Price updated successfully')

    }

  }

  return prices ? (
    <div className="flex flex-col">
      <div><Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Price</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {prices.map(price => (
            <Table.Row key={price.id}>
              <Table.Cell>
                <CurrencyInput onValueChange={(v) => updateAmount({ id: price.id, amount: v })} symbol="" code={price.currency_code} defaultValue={price.amount} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table ></div>
      <div className="p-4">
        <Button variant="primary" onClick={updatePrice} className="w-full">Update Price</Button>
      </div>
    </div>
  ) : <Text size="xsmall" className="w-full text-center">No records</Text>
}