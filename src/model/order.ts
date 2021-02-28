interface Order {
    'First Name': string;
    'Last Name': string;
    Address: string;
    Phone: string;
    Email: string;
    'Customer Notes': string;
    'Payment method': string;
    Items: Item[];
    Price: number;
    Discount: number;
    'Refund Value': number;
    'Total Order Value': number;
    'Refund Reason': string;
    'Date Created': string;
    'Date Modified': string;
    Status: string;
    FromLastWeek: number;
    FromLastFourWeeks: number;
}

interface Item {
    Name: string;
    Quantity: number;
    Size: string;
    "Piece Price": number;
}
export { Order }