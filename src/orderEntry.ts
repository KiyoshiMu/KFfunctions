import { admin, db } from "./config/firebase";
import { Response } from "express";
import { Order } from "./model/order";
import { updateStat } from "./statEntry";
import { updateCustomerHistory } from "./customerEntry";
import { CancelReq, DoneReq, OrderReq, QueryReq } from "./model/orderReq";

const docsToArr = (
  docs: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
) => {
  const ret: FirebaseFirestore.DocumentData[] = [];
  docs.forEach((doc) => ret.push(doc.data()));
  return ret;
};

const getOrder = async (req: QueryReq, res: Response) => {
  const { CustomerId, Number, Status } = req.body;
  try {
    const order = await getRef(CustomerId)
      .where("Status", "==", Status ?? "start")
      .orderBy("DateModified")
      .limitToLast(Number ?? 1)
      .get();
    const ret = docsToArr(order);
    return res.status(200).json(ret);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const getRef = (customerId: string) =>
  db.collection("orders").doc(customerId).collection("history");

const addOrder = async (req: OrderReq, res: Response) => {
  const order = req.body;
  try {
    order.DateModified = admin.firestore.FieldValue.serverTimestamp();
    order.DateCreated = admin.firestore.Timestamp.fromMillis(
      Date.parse(order.DateCreated)
    );
    const addRes = await getRef(order.CustomerId).add(order);
    res.status(200).send({
      status: "success",
      message: "Order added successfully",
      data: { orderId: addRes.id },
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateOrder = async (req: DoneReq, res: Response) => {
  const {
    body: { Status, CustomerId, orderId },
  } = req;
  try {
    const order = getRef(CustomerId).doc(orderId);
    const orderData = await order.get();
    if (!orderData.exists) {
      return res.status(400).json({
        status: "error",
        message: "order doesn't exist",
      });
    }
    await order
      .update({
        Status: Status,
        DateModified: admin.firestore.FieldValue.serverTimestamp(),
      })
      .catch((error) => {
        return res.status(400).json({
          status: "error",
          message: error.message,
        });
      });
    const { Price, Items, DateCreated } = orderData.data() as Order;
    if (Status == "completed") {
      const date = DateCreated as admin.firestore.Timestamp;
      const monday = getMonday(date.toDate()).getTime();
      await Promise.all([
        updateStat(
          { updateIncome: Price, updateOrder: 1, week: monday },
          Items
        ),
        updateCustomerHistory(CustomerId, Items),
      ]);
    }
    return res.status(200).json({
      status: "success",
      message: "order updated successfully",
      data: { orderId },
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const getMonday = (date: Date) => {
  const day = date.getDay();
  return new Date(date.setDate(date.getDate() - day + (day == 0 ? -6 : 1)));
};

const cancelOrder = async (req: CancelReq, res: Response) => {
  const {
    body: { CustomerId, orderId },
  } = req;
  try {
    const order = getRef(CustomerId).doc(orderId);
    await order
      .update({
        Status: "cancel",
        DateModified: admin.firestore.FieldValue.serverTimestamp(),
      })
      .catch((error) => {
        return res.status(400).json({
          status: "error",
          message: error.message,
        });
      });
    return res.status(200).json({
      status: "success",
      message: "order deleted successfully",
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export { addOrder, updateOrder, cancelOrder, getOrder };
