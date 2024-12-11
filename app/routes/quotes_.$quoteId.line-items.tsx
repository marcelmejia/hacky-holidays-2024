import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import BatchActions from "~/components/list/utils/batch-actions";
import { LineItem, LineItemListResponse } from "~/types/line-item";
//import { Quote } from "~/types/quote";

export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  const response = await fetch(`${process.env.API_URL}quotes/${params.quoteId}/line-items`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.API_TOKEN}`,
      'Content-Type': 'application/json',
    }
  });
  if (!response.ok) {
    throw new Response("Failed to fetch data", { status: 500 });
  }
  const data = await response.json();

  for (const [index, lineItem] of data.data.entries()) {
    if (lineItem.product && lineItem.product.id) {
      const productResponse = await fetch(`${process.env.API_URL}products/${lineItem.product.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.API_TOKEN}`,
          'Content-Type': 'application/json',
        }
      });
      if (!productResponse.ok) {
        throw new Response("Failed to fetch data", { status: 500 });
      }
      const productData = await productResponse.json();
      data.data[index].product = productData.data;
    }
  }

  return json(data);
};

export default function Index() {
  const lineItemListResponse: LineItemListResponse = useLoaderData();
  const lineItems: Array<LineItem> = lineItemListResponse.data;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <div className="flex-auto">
      <div className="flex mb-4">
        <div className="flex-auto">
          <h2 className="leading-8 h-8">Line Items</h2>
        </div>
        <div className="flex-auto">
          <button type="button" className="text-sm text-gray-300 border border-gray-700 rounded px-3 inline-block h-8 leading-6 float-right ml-2">
            Add
            <span className="inline-block relative ml-2 border-t-4 border-t-gray-500 group-hover:border-t-gray-300 w-2 border-r-4 border-r-transparent border-l-4 border-l-transparent -top-[.125rem]"></span>
          </button>
        </div>
      </div>
      <table className="table-auto text-sm mb-5 w-full">
        <thead>
          <tr className="text-xs text-gray-400">
            <th className="py-2 px-2 border border-gray-800 text-center" colSpan={5}>Location</th>
            <th className="py-2 px-2 border border-gray-800 text-center" colSpan={3}>Price</th>
            <th className="py-2 px-2 border border-gray-800 text-center" colSpan={3}>Cost</th>
            <th className="py-2 px-2 border border-gray-800 text-center"></th>
          </tr>
          <tr className="text-xs text-gray-400">
            <th className="py-2 px-2 border border-gray-800 text-left"></th>
            <th className="py-2 px-2 border border-gray-800 text-left">Type</th>
            <th className="py-2 px-2 border border-gray-800 text-left">SKU</th>
            <th className="py-2 px-2 border border-gray-800 text-left">Detail</th>
            <th className="py-2 px-2 border border-gray-800 text-left">Qty</th>
            <th className="py-2 px-2 border border-gray-800 text-left">Unit</th>
            <th className="py-2 px-2 border border-gray-800 text-left">OTC</th>
            <th className="py-2 px-2 border border-gray-800 text-left">MRC</th>
            <th className="py-2 px-2 border border-gray-800 text-left">Unit</th>
            <th className="py-2 px-2 border border-gray-800 text-left">OTC</th>
            <th className="py-2 px-2 border border-gray-800 text-left">MRC</th>
            <th className="py-2 px-2 border border-gray-800 text-left"></th>
          </tr>
        </thead>
        <tbody>
          {lineItems.map((item) => (
            <tr key={item.id}>
              <td className="py-2 px-2 border border-gray-800 align-top"><input type="checkbox" /></td>
              <td className="py-2 px-2 border border-gray-800 align-top">
                <span className="bg-gray-500 inline-block px-2 py-1 rounded text-xs font-medium">{item.order_type}</span>
              </td>
              <td className="py-2 px-2 border border-gray-800 align-top">{item.product?.id}</td>
              <td className="py-2 px-2 border border-gray-800 align-top w-full">
                <input className="bg-gray-950 focus:outline-0 w-full" type="text" value={item.name} /><br />
                <input className="bg-gray-950 focus:outline-0 w-full text-xs text-gray-300" type="text" value={item.detail} />
              </td>
              <td className="py-2 px-2 border border-gray-800 align-top">
                <input className="bg-gray-950 focus:outline-0 w-16" type="number" step="1" value={item.quantity} />
              </td>
              <td className="py-2 px-2 border border-gray-800 align-top">
                <input className="bg-gray-950 focus:outline-0 w-24" type="number" step=".01" value={format2Decimals(getUnitPrice(item))} />
              </td>
              <td className="py-2 px-2 border border-gray-800 align-top">{formatter.format(item.one_time_price)}</td>
              <td className="py-2 px-2 border border-gray-800 align-top">{formatter.format(item.monthly_recurring_price * item.quantity)}</td>
              <td className="py-2 px-2 border border-gray-800 align-top"><input className="bg-gray-950 focus:outline-0 w-24" type="number" step=".01" value={format2Decimals(getUnitCost(item))} /></td>
              <td className="py-2 px-2 border border-gray-800 align-top">{formatter.format(item.one_time_cost)}</td>
              <td className="py-2 px-2 border border-gray-800 align-top">{formatter.format(item.monthly_recurring_cost * item.quantity)}</td>
              <td className="py-2 px-2 border border-gray-800 align-top">
                <button type="button" className="text-sm text-gray-300 border border-gray-700 rounded px-3 inline-block h-8 leading-6 float-right ml-2">
                  <span className="inline-block relative border-t-4 border-t-gray-500 group-hover:border-t-gray-300 w-2 border-r-4 border-r-transparent border-l-4 border-l-transparent -top-[.125rem]"></span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="text-xs text-gray-400">
            <th className="py-2 px-2 border border-gray-800 text-right" colSpan={4}>Totals</th>
            <th className="py-2 px-2 border border-gray-800 text-left">Quantity</th>
            <th className="py-2 px-2 border border-gray-800 text-left">Unit</th>
            <th className="py-2 px-2 border border-gray-800 text-left">OTC</th>
            <th className="py-2 px-2 border border-gray-800 text-left">MRC</th>
            <th className="py-2 px-2 border border-gray-800 text-left">Unit</th>
            <th className="py-2 px-2 border border-gray-800 text-left">OTC</th>
            <th className="py-2 px-2 border border-gray-800 text-left">MRC</th>
            <th className="py-2 px-2 border border-gray-800 text-left"></th>
          </tr>
          <tr>
            <td className="py-2 px-2 border border-gray-800 align-top" colSpan={4}></td>
            <td className="py-2 px-2 border border-gray-800 align-top"></td>
            <td className="py-2 px-2 border border-gray-800 align-top"></td>
            <td className="py-2 px-2 border border-gray-800 align-top"></td>
            <td className="py-2 px-2 border border-gray-800 align-top"></td>
            <td className="py-2 px-2 border border-gray-800 align-top"></td>
            <td className="py-2 px-2 border border-gray-800 align-top"></td>
            <td className="py-2 px-2 border border-gray-800 align-top"></td>
            <td className="py-2 px-2 border border-gray-800 align-top"></td>
          </tr>
        </tfoot>
      </table>
      <div className="text-xs text-gray-300 mb-4 flex">
        <div className="flex-auto">
          <BatchActions />
        </div>
      </div>
    </div>
  );
}

function getUnitPrice(item: LineItem): number {
  const unitPrice = item.product.cost_type == 'MRC' ? item.monthly_recurring_price : item.one_time_price;
  return unitPrice || 0;
}

function getUnitCost(item: LineItem): number {
  const unitPrice = item.product.cost_type == 'MRC' ? item.monthly_recurring_cost : item.one_time_cost;
  return unitPrice || 0;
}

function format2Decimals(value: number): string {
  return (Math.round(value * 100) / 100).toFixed(2);
}
