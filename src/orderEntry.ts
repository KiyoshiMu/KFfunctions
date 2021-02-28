import { db } from "./config/firebase";
import { Response } from "express";
import { Order } from "./model/order";
import { updateStat } from "./statEntry";
import { updateCustomerHistory } from "./customerEntry";

type Request = {
  body: Order;
  params: { orderId: string };
};

const addOrder = async (req: Request, res: Response) => {
  try {
    const order = req.body;
    const addRes = await db.collection("orders").add(order);
    await updateStat(order.Price, 1, order.Items);
    await updateCustomerHistory(order.Email, { orderId: addRes.id });
    res.status(200).send({
      status: "success",
      message: "Order added successfully",
      data: { orderId: addRes.id },
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateOrder = async (req: Request, res: Response) => {
  const {
    body: { Status },
    params: { orderId },
  } = req;
  console.log(orderId);
  try {
    const updateRes = db
      .collection("orders")
      .doc(orderId)
      .update({ Status: Status, "Date Modified": Date.now.toString() });

    await updateRes.catch((error) => {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    });
    return res.status(200).json({
      status: "success",
      message: "order updated successfully",
      data: orderId,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const cancelOrder = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  console.log(orderId);
  try {
    const order = db.collection("entries").doc(orderId);
    const data = (await order.get()).data() as Order;
    data.Items.forEach((e) => (e.Quantity = -e.Quantity));
    await updateStat(-data.Price, -1, data.Items);
    await order.delete().catch((error) => {
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

export { addOrder, updateOrder, cancelOrder };
