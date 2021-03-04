import { Customer } from "./customer";

export interface InitReq {
  body: Customer;
}

export interface ViewReq {
  body: {
    customerId: string;
  };
}
