import { Order } from "./order";

export interface OrderReq {
  body: Order;
}

export interface DoneReq {
  body: {
    Status: string;
    CustomerId: string;
    orderId: string;
  };
}

export interface CancelReq {
  body: {
    CustomerId: string;
    orderId: string;
  };
}

export interface QueryReq {
  body: {
    CustomerId: string;
    Number?: number;
    Status?: string;
  };
}
