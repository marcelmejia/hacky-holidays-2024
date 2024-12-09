import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { QuoteListResponse, QuoteSalesUser, Quote } from "../types/quote";
import { UserSimple } from "~/types/user";
import PerPageDropdown from "~/components/list/utils/per-page-dropdown";
import SortDropdown from "~/components/list/utils/sort-dropdown";
import Pager from "~/components/list/utils/pager";
import MetaData from "~/components/list/utils/meta-data";
import BatchActions from "~/components/list/utils/batch-actions";
import ListActions from "~/components/list/utils/list-actions";

export const meta: MetaFunction = () => {
  return [
    { title: "Quotes - Expedient" },
    { name: "description", content: "Expedient Quotes" },
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
  const response = await fetch(`${process.env.API_URL}quotes?${params.toString()}`, {
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
  const data: QuoteListResponse = useLoaderData();
  const quotes: Array<Quote> = data.data;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const sortOptions = ['id asc', 'id desc', 'created_at asc', 'created_at desc'];

  return (
    <div className="p-5">
      <h1 className="text-lg font-semibold mb-4">Quotes</h1>
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
            <th align="left" className="py-2 px-2 border-b border-gray-800">Sales Team</th>
            <th align="left" className="py-2 px-2 border-b border-gray-800">OTC</th>
            <th align="left" className="py-2 px-2 border-b border-gray-800">MRC</th>
            <th align="left" className="py-2 px-2 border-b border-gray-800"></th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((item) => (
            <tr key={item.id}>
              <td valign="top" className="py-2 px-2 border-b border-gray-800"><input type="checkbox" /></td>
              <td valign="top" className="py-2 px-2 border-b border-gray-800">
                <span className="bg-gray-500 inline-block px-2 py-1 rounded text-xs font-medium">{item.status}</span>
              </td>
              <td valign="top" className="py-2 px-2 border-b border-gray-800">{item.id}</td>
              <td valign="top" className="py-2 px-2 border-b border-gray-800">
                {item.title}<br/>
                <span className="text-xs text-gray-300"><b>Client:</b> {item.client?.name}, <b>Contract Type:</b> {item.contract_type ? item.contract_type : 'None'}</span>
              </td>
              <td valign="top" className="py-2 px-2 border-b border-gray-800">
                {getSalesTeamUsers(item).map((user, index) => (
                  <span key={index} className="rounded-full bg-gray-500 inline-block w-8 h-8 text-center text-xs border border-gray-950 align-middle leading-8" title={user.full_name}>{getInitials(user.full_name)}</span>
                ))}
              </td>
              <td valign="top" className="py-2 px-2 border-b border-gray-800">{formatter.format(item.nrr_impact)}</td>
              <td valign="top" className="py-2 px-2 border-b border-gray-800">{formatter.format(item.mrr_impact)}</td>
              <td valign="top" className="py-2 px-2 border-b border-gray-800">
                <div className="border border-gray-700 rounded-md text-xs h-8 inline-block whitespace-nowrap float-right">
                  <Link to={`/quotes/${item.id}`} className="text-gray-300 hover:text-white inline-block float-left h-8 leading-8 px-3 font-medium">View</Link>
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

function getInitials(fullName: string): string {
  let initials: string = '';
  const nameParts = fullName.split(' ');
  nameParts.forEach((part: string) => {
    initials += part[0].toUpperCase();
  });

  return initials;
}

function getSalesTeamUsers(quote: Quote): Array<UserSimple> {
  const salesTeam: Array<QuoteSalesUser> = [
    quote.primary_sales_rep,
    quote.secondary_sales_rep,
    quote.solutions_architect,
  ];
  const salesUsers: Array<UserSimple> = [];
  
  salesTeam.forEach((member: QuoteSalesUser) => {
    if (member && member.user) {
      salesUsers.push(member.user);
    }
  });
  
  return salesUsers;
}
