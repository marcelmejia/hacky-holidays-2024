import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { Delivery, DeliveryListResponse, DELIVERY_BILLED_STATUS_BILLED } from "~/types/delivery";
import { FormatDateShort } from "~/helpers/datetime";
import PerPageDropdown from "~/components/list/utils/per-page-dropdown";
import SortDropdown from "~/components/list/utils/sort-dropdown";
import MetaData from "~/components/list/utils/meta-data";
import Pager from "~/components/list/utils/pager";
import BatchActions from "~/components/list/utils/batch-actions";
import ListActions from "~/components/list/utils/list-actions";

export const meta: MetaFunction = () => {
  return [
    { title: "Deliveries - Expedient" },
    { name: "description", content: "Expedient Deliveries" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Get query parameters from the request URL
  const url = new URL(request.url);
  const params = new URLSearchParams({
    order_by: url.searchParams.get('order_by') || 'id desc',
    per_page: url.searchParams.get('per_page') || '30',
    page: url.searchParams.get('page') || '1',
  });
  const response = await fetch(`${process.env.API_URL}deliveries?${params.toString()}`, {
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

  // load quotes and set them for the deliveries
  for (const [index, delivery] of data.data.entries()) {
    if (delivery.quote_id) {
      const quoteResponse = await fetch(`${process.env.API_URL}quotes/${delivery.quote_id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.API_TOKEN}`,
          'Content-Type': 'application/json',
        }
      });
      if (!quoteResponse.ok) {
        throw new Response("Failed to fetch data", { status: 500 });
      }
      const quoteData = await quoteResponse.json();
      data.data[index].quote = quoteData.data;
    }
  }

  return json(data);
};

export default function Index() {
  const data: DeliveryListResponse = useLoaderData();
  const deliveries: Array<Delivery> = data.data;
  const sortOptions = ['id asc', 'id desc', 'created_at asc', 'created_at desc'];

  return (
    <div className="p-5">
      <h1 className="text-lg font-semibold mb-4">Deliveries</h1>
      <div className="mb-4 flex">
        <div className="flex-auto">
          <PerPageDropdown />
          <SortDropdown sortOptions={sortOptions} sortDefault="id desc" />
        </div>
        <div className="flex-auto">
          <ListActions />
        </div>
      </div>
      <div className="text-xs text-gray-300 mb-4 flex">
        <div className="flex-auto">
          <MetaData page={data.page} perPage={data.rpp} total={data.total} />
        </div>
        <div className="flex-auto">
          <Pager page={data.page} />
        </div>
      </div>
      <table className="table-auto text-sm mb-5 w-full">
        <thead>
          <tr className="text-xs text-gray-400">
            <th align="left" className="py-2 px-2 border-b border-gray-800"></th>
            <th align="left" className="py-2 px-2 border-b border-gray-800">Status</th>
            <th align="left" className="py-2 px-2 border-b border-gray-800">ID</th>
            <th align="left" className="py-2 px-2 border-b border-gray-800">Title</th>
            <th align="left" className="py-2 px-2 border-b border-gray-800">Build Time</th>
            <th align="left" className="py-2 px-2 border-b border-gray-800">Progress</th>
            <th align="left" className="py-2 px-2 border-b border-gray-800">Billing</th>
            <th align="left" className="py-2 px-2 border-b border-gray-800"></th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((item) => (
            <tr key={item.id}>
              <td valign="top" className="py-2 px-2 border-b border-gray-800"><input type="checkbox" /></td>
              <td valign="top" className="py-2 px-2 border-b border-gray-800">
                <span className="bg-gray-500 inline-block px-2 py-1 rounded text-xs font-medium">{item.status?.name}</span>
              </td>
              <td valign="top" className="py-2 px-2 border-b border-gray-800">{item.quote?.id}</td>
              <td valign="top" className="py-2 px-2 border-b border-gray-800">
                {item.quote?.title}<br/>
                <span className="text-xs text-gray-300"><b>Client:</b> {item.quote?.client?.name}, <b>Project Manager:</b> {item.project_manager && item ? item.project_manager.full_name : 'None'}</span>
              </td>
              <td valign="top" className="py-2 px-2 border-b border-gray-800">{item.build_time ?? 0}</td>
              <td valign="top" className="py-2 px-2 border-b border-gray-800">{item.line_items_delivered_count ?? 0} of {item.line_items_count ?? 0}</td>
              <td valign="top" className="py-2 px-2 border-b border-gray-800">
                <span className="bg-gray-500 inline-block px-2 py-1 rounded text-xs font-medium" title={(item.billed_status.id == DELIVERY_BILLED_STATUS_BILLED && item.billed_at && item.billed_by) ? `${FormatDateShort(item.billed_at)} by ${item.billed_by.full_name}`: ""}>{item.billed_status?.name}</span>
              </td>
              <td valign="top" className="py-2 px-2 border-b border-gray-800">
                <div className="border border-gray-700 rounded-md text-xs h-8 inline-block whitespace-nowrap float-right">
                  <Link to={`/deliveries/${item.id}`} className="text-gray-300 hover:text-white inline-block float-left h-8 leading-8 px-3 font-medium">View</Link>
                  <button className="border-l border-l-gray-700 h-8 py-2 px-3 inline-block group">
                    <span className="inline-block border-t-4 border-t-gray-500 group-hover:border-t-gray-300 w-2 h-4 border-r-4 border-r-transparent border-l-4 border-l-transparent mt-[.38rem]"></span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-xs text-gray-300 mb-4 flex">
        <div className="flex-auto">
          <BatchActions />
        </div>
        <div className="flex-auto">
          <Pager page={data.page} />
        </div>
      </div>
    </div>
  );
}
