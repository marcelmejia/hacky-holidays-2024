import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
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
      <h1 className="text-lg font-semibold mb-5">
        Quotes
        <span className="text-gray-500"> / </span>
        {quote.id}: {quote.title}
      </h1>
      <div>
        Quote Info Here
      </div>
    </div>
  )
}
