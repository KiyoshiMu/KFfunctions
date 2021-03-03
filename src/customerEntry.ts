import { admin, db } from "./config/firebase";
import { Response } from "express";
import { Customer } from "./model/customer";
import { Item } from "./model/order";

type Request = {
  body: Customer;
  params: { customerId: string };
};

const getCustomerSamples = async (req: Request, res: Response) => {
  try {
    const customerSample = (await db.collection("customer").limit(3).get())
      .docs;
    const ret = customerSample.map((doc) => doc.data());
    return res.status(200).json(ret);
  } catch (error) {
    return res.status(500).json(error.message);
  }
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

const updateCustomerHistory = async (customerId: string, items: Item[]) => {
  const customerRef = db.collection("customer").doc(customerId);
  const update = new Map(
    items.map((e) => [
      `History.${e.Id}`,
      admin.firestore.FieldValue.increment(e.Quantity),
    ])
  );
  update.set("Latest Order Date", admin.firestore.FieldValue.serverTimestamp());
  const updateObj = Object.fromEntries(update.entries());
  try {
    await customerRef.update(updateObj);
  } catch (error) {
    if (error.code === 5) {
      customerRef.set({ History: {} }, { merge: true });
      customerRef.update(updateObj);
    } else {
      throw error;
    }
  }
};

export { initCustomer, updateCustomerHistory, getCustomerSamples };
