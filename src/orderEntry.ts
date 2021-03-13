import { admin, db } from "./config/firebase";
import { Response } from "express";
import { Order, Status } from "./model/order";
import { updateStat } from "./statEntry";
import { updateCustomerHistory } from "./customerEntry";
import { CancelReq, DoneReq, OrderReq, ViewReq } from "./model/orderReq";

const getOrder = async (req: ViewReq, res: Response) => {
  const { customerId, count: Number, status } = req.body;
  try {
    const order = await getRef(customerId)
      .where("status", "==", status ?? Status.start)
      .orderBy("dateModified")
      .limitToLast(Number ?? 1)
      .get();
    const ret = order.docs.map((d) => d.data());
    return res.status(200).json(ret);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const getRef = (customerId: string) =>
  db.collection("orders").doc("orders").collection(customerId);

const addOrder = async (req: OrderReq, res: Response) => {
  const order = req.body;
  const { dateCreated, customerId } = order;
  try {
    order.dateModified = admin.firestore.FieldValue.serverTimestamp();
    order.dateCreated = admin.firestore.Timestamp.fromMillis(
      Date.parse(dateCreated)
    );
    const addRes = await getRef(customerId).add(order);
    res.status(200).send({
      status: "success",
      message: "Order added successfully",
      data: { orderId: addRes.id, customerId },
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
    const order = getRef(customerId).doc(orderId);
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

    if (status == Status.done) {
      await Promise.all([
        updateStat(
          { updateIncome: price, updateOrder: 1, weekMark: monday },
          items
        ),
        updateCustomerHistory(customerId, items, price),
      ]);
    }
    return res.status(200).json({
      status: "success",
      message: "order updated successfully",
      data: { orderId, customerId },
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const getMonday = (date: Date) => {
  const day = date.getDay() || 7;
  if (day != 1) {
    date.setHours(-24 * (day - 1));
  }
  date.setHours(0, 0, 0, 0);
  return date;
};

const cancelOrder = async (req: CancelReq, res: Response) => {
  const {
    body: { customerId, orderId },
  } = req;
  try {
    const order = getRef(customerId).doc(orderId);
    await order
      .update({
        status: Status.cancel,
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
