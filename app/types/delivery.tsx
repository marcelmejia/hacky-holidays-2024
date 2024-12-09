import { Quote } from "./quote";
import { UserSimple } from "./user";

export const DELIVERY_BILLED_STATUS_BILLED = 4;

export type Delivery = {
  id: number;
  billed_at: string;
  billed_by: UserSimple;
  build_time: number;
  billed_status: DeliveryBilledStatus;
  line_items_count: number;
  line_items_delivered_count: number;
  quote: Quote;
  project_manager: UserSimple;
  status: DeliveryStatus;
}

export type DeliveryBilledStatus = {
  id: number;
  name: string;
}

export type DeliveryStatus = {
  id: number;
  name: string;
}

export type DeliveryListResponse = {
  total: number;
  page: number;
  rpp: number;
  data: Delivery[];
}
