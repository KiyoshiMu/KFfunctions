# Firebase API prototyping for KitchenFuel

Hope it's useful for reference.

## Schema Draft

### Order 
```typescript
interface Order {
  customerId: string;
  items: Item[];
  price: number;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  customerNotes: string;
  paymentMethod: string;
  discount: number;
  refundValue: number;
  totalOrderValue: number;
  refundReason: string;
  dateCreated: string | any;
  dateModified: string | any;
  status: string;
}

interface Item {
  mealId: string;
  name: string;
  quantity: number;
  size: string;
  piecePrice: number;
}
```

### Meal

```typescript
interface MealUnit {
  mealId: string;
  name: string;
  price: number;
  description?: string;
  size: string;
  cover?: string[];
  totalOrders?: number;
  weeklyOrders?: number;
}
```

### Stat

```typescript
interface Stat {
  income: number;
  orders: number;
}
```

### Customer

```typescript
interface Customer {
  customerId: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  point?: number;
  latestOrderDate?: string;
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