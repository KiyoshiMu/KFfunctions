export interface Order {
  CustomerId: string;
  Items: Item[];
  Price: number;
  FirstName: string;
  LastName: string;
  Address: string;
  Phone: string;
  Email: string;
  CustomerNotes: string;
  PaymentMethod: string;
  Discount: number;
  RefundValue: number;
  TotalOrderValue: number;
  RefundReason: string;
  DateCreated: string | any;
  DateModified: string | any;
  Status: string;
}

export interface Item {
  Id: string;
  Name: string;
  Quantity: number;
  Size: string;
  PiecePrice: number;
}
