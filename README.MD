# Firebase API prototyping for KitchenFuel

Hope it's useful for reference.

## Schema Draft

### Order 
```typescript
interface Order {
  "First Name": string;
  "Last Name": string;
  Address: string;
  Phone: string;
  Email: string;
  "Customer Notes": string;
  "Payment method": string;
  Items: Item[];
  Price: number;
  Discount: number;
  "Refund Value": number;
  "Total Order Value": number;
  "Refund Reason": string;
  "Date Created": string;
  "Date Modified": string;
  Status: string;
  FromLastWeek: number;
  FromLastFourWeeks: number;
}

interface Item {
  Name: string; # id
  Quantity: number;
  Size: string;
  "Piece Price": number;
}
```

### Meal

```typescript
interface Meal {
  Name: string; # id
  Description: string;
  orderHistory: number;
  orderWeekly: number;
}
```

### Stat

```typescript
interface Stat {
  Income: number;
  Orders: number;
}
```

### Customer

```typescript
interface Customer {
  "First Name": string;
  "Last Name": string;
  Phone: string;
  Email: string;
  Point: number;
  "Order History": OrderHistory[];
}

interface OrderHistory {
  orderId: string;
  status?: string;
}
```

## Database talk
![db talk](https://storage.googleapis.com/pathopatho/db_talk.png)

## API

### initCustomer

![initCustomer](https://storage.googleapis.com/pathopatho/initCustomer.png)

### addOrder

The sale record before the new order:
![start](https://storage.googleapis.com/pathopatho/start.png)

Add new order:
![addOrder](https://storage.googleapis.com/pathopatho/addOrder.png)

The sale record after the new order (realtime update):
![update](https://storage.googleapis.com/pathopatho/update.png)