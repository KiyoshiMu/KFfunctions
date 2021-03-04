export interface Customer {
  Id: string;
  FirstName: string;
  LastName: string;
  Address: string;
  Phone: string;
  Email: string;
  Point?: number;
  LatestOrderDate?: string;
}
