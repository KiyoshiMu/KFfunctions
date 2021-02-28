import { admin, db } from "./config/firebase";
import { Response } from "express";
import { Customer, OrderHistory } from "./model/customer";

type Request = {
  body: Customer;
  params: { customerId: string };
};

const initCustomer = async (req: Request, res: Response) => {
  try {
    const customer = req.body;
    await db.collection("customer").doc(customer.Email).set(customer);
    res.status(200).send({
      Customerus: "success",
      message: "Customer init successfully",
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateCustomerHistory = async (
  customerId: string,
  orderHistory: OrderHistory
) => {
  const customerRef = db.collection("customer").doc(customerId);
  await customerRef.update({
    "Order History": admin.firestore.FieldValue.arrayUnion(orderHistory),
  });
};

export { initCustomer, updateCustomerHistory };
