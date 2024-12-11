import { Product } from "./product";

export type LineItem = {
  id: number;
  detail: string;
  name: string;
  order_type: string;
  quantity: number;
  product: Product;
  monthly_recurring_price: number;
  monthly_recurring_cost: number;
  one_time_price: number;
  one_time_cost: number;
}

export type LineItemListResponse = {
  total: number;
  page: number;
  rpp: number;
  data: LineItem[];
}
