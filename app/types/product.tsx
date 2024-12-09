export type Product = {
  id: number;
  name: string;
  delivery_type: string;
  detail: string;
  project_complexity: string;
  status: string;
}

export type ProductListResponse = {
  total: number;
  page: number;
  rpp: number
  data: Product[];
}
