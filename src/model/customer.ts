export interface Customer {
  "First Name": string;
  "Last Name": string;
  Phone: string;
  Email: string;
  Point: number;
  "Order History": OrderHistory[];
}

export interface OrderHistory {
  orderId: string;
  status?: string;
}
