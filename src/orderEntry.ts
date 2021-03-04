import { admin, db } from "./config/firebase";
import { Response } from "express";
import { Order } from "./model/order";
import { updateStat } from "./statEntry";
import { updateCustomerHistory } from "./customerEntry";
import { CancelReq, DoneReq, OrderReq, ViewReq } from "./model/orderReq";

const docsToArr = (
  docs: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
) => {
  const ret: FirebaseFirestore.DocumentData[] = [];
  docs.forEach((doc) => ret.push(doc.data()));
  return ret;
};

const getOrder = async (req: ViewReq, res: Response) => {
  const { customerId, count: Number, status } = req.body;
  try {
    const order = await getRef(customerId)
      .where("status", "==", status ?? "start")
      .orderBy("dateModified")
      .limitToLast(Number ?? 1)
      .get();
    const ret = docsToArr(order);
    return res.status(200).json(ret);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const getRef = (customerId: string) =>
  db.collection("orders").where("customerId", "==", customerId);

const addOrder = async (req: OrderReq, res: Response) => {
  const order = req.body;
  try {
    order.dateModified = admin.firestore.FieldValue.serverTimestamp();
    order.dateCreated = admin.firestore.Timestamp.fromMillis(
      Date.parse(order.dateCreated)
    );
    const addRes = await db.collection("orders").add(order);
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
    body: { status, customerId, orderId },
  } = req;
  try {
    const order = db.collection("orders").doc(orderId);
    const orderData = await order.get();
    if (!orderData.exists) {
      return res.status(400).json({
        status: "error",
        message: "order doesn't exist",
      });
    }
    const { price, items, dateCreated } = orderData.data() as Order;
    const date = dateCreated as admin.firestore.Timestamp;
    const monday = getMonday(date.toDate()).getTime();

    await order
      .update({
        status: status,
        dateModified: admin.firestore.FieldValue.serverTimestamp(),
        weekMark: monday,
      })
      .catch((error) => {
        return res.status(400).json({
          status: "error",
          message: error.message,
        });
      });

    if (status == "completed") {
      await Promise.all([
        updateStat(
          { updateIncome: price, updateOrder: 1, weekMark: monday },
          items
        ),
        updateCustomerHistory(customerId, items),
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
    body: { orderId },
  } = req;
  try {
    const order = db.collection("orders").doc(orderId);
    await order
      .update({
        status: "cancel",
        dateModified: admin.firestore.FieldValue.serverTimestamp(),
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
