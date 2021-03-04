import { Order } from "./order";

export interface OrderReq {
  body: Order;
}

export interface DoneReq {
  body: {
    status: string;
    customerId: string;
    orderId: string;
  };
}

export interface CancelReq {
  body: {
    customerId: string;
    orderId: string;
  };
}

export interface ViewReq {
  body: {
    customerId: string;
    count?: number;
    status?: string;
  };
}
