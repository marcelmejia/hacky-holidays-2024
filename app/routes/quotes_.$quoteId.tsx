import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { Quote, QuoteResponse } from "~/types/quote";

export const meta: MetaFunction = () => {
  return [
    { title: "Quotes - Expedient" },
    { name: "description", content: "Expedient Quotes" },
  ];
};

export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  const response = await fetch(`${process.env.API_URL}quotes/${params.quoteId}`, {
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
  const quoteResponse: QuoteResponse = useLoaderData();
  const quote: Quote = quoteResponse.data;
  
  return (
    <div className="p-5">
      <div className="flex">
        <div className="flex-auto">
          <h1 className="text-lg font-semibold mb-5">
            Quotes
            <span className="text-gray-500"> / </span>
            {quote.id}: {quote.title}
          </h1>
        </div>
        <div className="flex-auto">
          <button type="button" className="text-sm text-gray-300 border border-gray-700 rounded px-3 inline-block h-8 leading-6 float-right ml-2">
            Actions
            <span className="inline-block relative ml-2 border-t-4 border-t-gray-500 group-hover:border-t-gray-300 w-2 border-r-4 border-r-transparent border-l-4 border-l-transparent -top-[.125rem]"></span>
          </button>
        </div>
      </div>
      <div className="mb-4">
        <ul className="text-gray-300">
          <li className="px-3 h-8 leading-8 inline-block text-sm bg-gray-700 text-white font-medium rounded mr-2">Line Items</li>
          <li className="px-3 h-8 leading-8 inline-block text-sm mr-2">Attachments</li>
          <li className="px-3 h-8 leading-8 inline-block text-sm mr-2">Comments</li>
          <li className="px-3 h-8 leading-8 inline-block text-sm mr-2">Logs</li>
        </ul>
      </div>
      <div className="flex">
        <Outlet />
        <div className="flex-initial w-[20rem]">
          Sidebar
        </div>
      </div>
    </div>
  )
}
