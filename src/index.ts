import * as functions from "firebase-functions";
import * as express from "express";
import { addOrder, cancelOrder, updateOrder } from "./orderEntry";
import { initMeal } from "./mealEntry";
import { initStat } from "./statEntry";
import { initCustomer } from "./customerEntry";

const app = express();

app.get("/", (req, res) => res.status(200).send("Hey there!"));

app.post("/initStat", initStat);
app.post("/meals", initMeal);
app.post("/customer", initCustomer);

app.post("/orders", addOrder);
app.patch("/orders/:orderId", updateOrder);
app.delete("/orders/:orderId", cancelOrder);

exports.app = functions.https.onRequest(app);
