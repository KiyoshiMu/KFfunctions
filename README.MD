# Firebase API prototyping for KitchenFuel

Hope it's useful for reference.

## Usage Example

### Add to cart

    curl -H "Content-Type: application/json" --data @reqOrder.json https://us-central1-kitchenfuel-data.cloudfunctions.net/app/addOrder

reqOrder.json should be like /functions/data/reqOrder.json:

```json
{
  "customerId": "1111@gmail.com",
  "items": [
    {
      "mealId": "Veggie_MealSteaklarge",
      "name": "Veggie MealSteak",
      "quantity": 1,
      "size": "large",
      "piecePrice": 20
    },
    {
      "mealId": "Sweet_Potatolarge",
      "name": "Sweet Potato",
      "quantity": 2,
      "size": "large",
      "piecePrice": 10
    }
  ],
  "price": 40,
  "status": "start",
  "dateCreated": "2019-08-19T18:04:05"
}
```

**"status" is used to mark _start_:in cart; _done_: paid; _cancel_: cancel**

Happy Respond:

    {status: "success",
    message: "Order added successfully",
    data: { orderId, customerId }

orderId, customerId are used to identify an order.

### View Cart/Order

    curl -H "Content-Type: application/json" --data @reqView.json https://us-central1-kitchenfuel-data.cloudfunctions.net/app/getOrder

reqView.json should be like /functions/data/reqView.json:

```json
{
  "customerId": "1111@gmail.com",
  "Number": 2,
  "status": "start"
}
```

Happy Respond:

```json
[
  {
    "customerId": "1111@gmail.com",
    "dateModified": { "_seconds": 1615852943, "_nanoseconds": 316000000 },
    "status": "start",
    "price": 40,
    "dateCreated": { "_seconds": 1566237845, "_nanoseconds": 0 },
    "items": [
      {
        "name": "Veggie MealSteak",
        "piecePrice": 20,
        "quantity": 1,
        "size": "large",
        "mealId": "Veggie_MealSteaklarge"
      },
      {
        "piecePrice": 10,
        "mealId": "Sweet_Potatolarge",
        "size": "large",
        "quantity": 2,
        "name": "Sweet Potato"
      }
    ]
  }
]
```

### After payment

    curl -H "Content-Type: application/json" --data @reqUpdate.json https://us-central1-kitchenfuel-data.cloudfunctions.net/app/updateOrder

reqUpdate.json should be like /functions/data/reqUpdate.json:

**Change the orderId to the orderId returned before**

```json
{
  "customerId": "1111@gmail.com",
  "orderId": "##",
  "status": "done"
}
```

### Paid Order will update related statistics in real-time

For example:

    curl https://us-central1-kitchenfuel-data.cloudfunctions.net/app/stat

will return the overall income and order numbers

I suggest to use Firebase Library with the framework (Angular, React or Vue) to query the statistics data and display them as you see fit.

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


## Useful Refs:

1. https://firebase.google.com/docs/admin/setup