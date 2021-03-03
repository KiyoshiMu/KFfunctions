export interface Order {
  CustomerId: string;
  Items: Item[];
  Price: number;
  "First Name": string;
  "Last Name": string;
  Address: string;
  Phone: string;
  Email: string;
  "Customer Notes": string;
  "Payment method": string;
  Discount: number;
  "Refund Value": number;
  "Total Order Value": number;
  "Refund Reason": string;
  "Date Created": string;
  "Date Modified": any;
  Status: string;
}

export interface Item {
  Id: string;
  Name: string;
  Quantity: number;
  Size: string;
  "Piece Price": number;
}
