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
      .doc(customer.Id)
      .set(customer, { merge: true });
    res.status(200).send({
      Customerus: "success",
      message: "Customer init successfully",
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateCustomerHistory = async (customerId: string, items: Item[]) => {
  const customerRef = db.collection("customer").doc(customerId);
  const update = Object.fromEntries(
    items.map((e) => [
      `History.${e.Id}`,
      admin.firestore.FieldValue.increment(e.Quantity),
    ])
  );
  update.LatestOrderDate = admin.firestore.FieldValue.serverTimestamp();
  try {
    await customerRef.update(update);
  } catch (error) {
    if (error.code === 5) {
      customerRef.set({ History: {} }, { merge: true });
      customerRef.update(update);
    } else {
      throw error;
    }
  }
};

export { initCustomer, updateCustomerHistory, getCustomer };
