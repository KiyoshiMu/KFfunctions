import * as functions from "firebase-functions";
import * as express from "express";
import {
  addOrder,
  cancelOrder,
  getOrderSamples,
  updateOrder,
} from "./orderEntry";
import { getMealStatSamples, initMeal } from "./mealEntry";
import { getStat, initStat } from "./statEntry";
import { getCustomerSamples, initCustomer } from "./customerEntry";

const app = express();

app.get("/", (req, res) => res.status(200).send("Hey there!"));

app.post("/initStat", initStat);
app.post("/meal", initMeal);
app.post("/customer", initCustomer);

app.post("/orders", addOrder);
app.patch("/orders/:orderId", updateOrder);
app.delete("/orders/:orderId", cancelOrder);

app.get("/orders", getOrderSamples);
app.get("/customers", getCustomerSamples);
app.get("/stat", getStat);
app.get("/mealStat", getMealStatSamples);
exports.app = functions.https.onRequest(app);
