import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { Product, ProductListResponse } from "~/types/product";
import PerPageDropdown from "~/components/list/utils/per-page-dropdown";
import SortDropdown from "~/components/list/utils/sort-dropdown";
import MetaData from "~/components/list/utils/meta-data";
import Pager from "~/components/list/utils/pager";
import BatchActions from "~/components/list/utils/batch-actions";
import ListActions from "~/components/list/utils/list-actions";

export const meta: MetaFunction = () => {
  return [
    { title: "Products - Expedient" },
    { name: "description", content: "Expedient Products" },
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
  const response = await fetch(`${process.env.API_URL}products?${params.toString()}`, {
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

  return json(data);
};

export default function Index() {
  const data: ProductListResponse = useLoaderData();
  const products: Array<Product> = data.data;
  const sortOptions = ['id asc', 'id desc', 'created_at asc', 'created_at desc'];

  return (
    <div className="p-5">
      <h1 className="text-lg font-semibold mb-4">Products</h1>
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
            <th align="left" className="py-2 px-2 border-b border-gray-800">Delivery Type</th>
            <th align="left" className="py-2 px-2 border-b border-gray-800">Complexity</th>
            <th align="left" className="py-2 px-2 border-b border-gray-800"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => (
            <tr key={item.id}>
              <td valign="top" className="py-2 px-2 border-b border-gray-800"><input type="checkbox" /></td>
              <td valign="top" className="py-2 px-2 border-b border-gray-800">
                <span className="bg-gray-500 inline-block px-2 py-1 rounded text-xs font-medium">{item.status}</span>
              </td>
              <td valign="top" className="py-2 px-2 border-b border-gray-800">{item.id}</td>
              <td valign="top" className="py-2 px-2 border-b border-gray-800">
                {item.name}<br/>
                <span className="text-xs text-gray-300">{item.detail}</span>
              </td>
              <td valign="top" className="py-2 px-2 border-b border-gray-800">{item.delivery_type}</td>
              <td valign="top" className="py-2 px-2 border-b border-gray-800">{item.project_complexity}</td>
              <td valign="top" className="py-2 px-2 border-b border-gray-800">
                <div className="border border-gray-700 rounded-md text-xs h-8 inline-block whitespace-nowrap float-right">
                  <Link to={`/products/${item.id}`} className="text-gray-300 hover:text-white inline-block float-left h-8 leading-8 px-3 font-medium">View</Link>
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
