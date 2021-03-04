export interface Customer {
  customerId: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  point?: number;
  latestOrderDate?: string;
}
