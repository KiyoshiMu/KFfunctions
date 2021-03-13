import { admin, db } from "./config/firebase";
import { Response } from "express";
import { Item } from "./model/order";
import { InitReq, ViewReq } from "./model/customerReq";

const getCustomer = async (req: ViewReq, res: Response) => {
  const { customerId } = req.body;
  try {
    const customer = (await db.collection("customer").doc(customerId).get())
      ?.data;
    return res.status(200).json(customer);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const initCustomer = async (req: InitReq, res: Response) => {
  try {
    const customer = req.body;
    await db
      .collection("customer")
      .doc(customer.customerId)
      .set(customer, { merge: true });
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
  items: Item[],
  consume: number
) => {
  const customerRef = db.collection("customer").doc(customerId);
  if (!(await customerRef.get()).exists) {
    await customerRef.set({ history: {}, customerId }, { merge: true });
  }
  const update = Object.fromEntries(
    items.map((e) => [
      `history.${e.mealId}`,
      admin.firestore.FieldValue.increment(e.quantity),
    ])
  );
  update.latestOrderDate = admin.firestore.FieldValue.serverTimestamp();
  update.orders = admin.firestore.FieldValue.increment(1);
  update.consume = admin.firestore.FieldValue.increment(consume);
  await customerRef.update(update);
};

export { initCustomer, updateCustomerHistory, getCustomer };
