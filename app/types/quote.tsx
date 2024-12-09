import { ClientSimple } from "./client";
import { UserSimple } from "./user";

export type QuoteSalesUser = {
  user: UserSimple;
  role: string;
}

export type Quote = {
  client: ClientSimple;
  contract_type: string;
  id: number;
  mrr_impact: number;
  nrr_impact: number;
  primary_sales_rep: QuoteSalesUser;
  secondary_sales_rep: QuoteSalesUser;
  solutions_architect: QuoteSalesUser;
  status: string;
  title: string;
}

export type QuoteListResponse = {
  total: number;
  page: number;
  rpp: number;
  data: Quote[];
}

export type QuoteResponse = {
  data: Quote;
}
