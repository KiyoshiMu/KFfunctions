export enum Status {
  start = "start",
  done = "done",
  cancel = "cancel",
}

export interface Order {
  customerId: string;
  items: Item[];
  price: number;
  firstName?: string;
  lastName?: string;
  address?: string;
  phone?: string;
  email?: string;
  customerNotes?: string;
  paymentMethod?: string;
  discount?: number;
  refundValue?: number;
  totalOrderValue?: number;
  refundReason?: string;
  dateCreated: string | any;
  dateModified?: string | any;
  status: Status;
}

export interface Item {
  mealId: string;
  name: string;
  quantity: number;
  size: string;
  piecePrice: number;
}
