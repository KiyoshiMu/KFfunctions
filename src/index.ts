import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";
import { addOrder, cancelOrder, getOrder, updateOrder } from "./orderEntry";
import { getMealStatSamples, initMeal } from "./mealEntry";
import { getStat, initStat } from "./statEntry";
import { getCustomerSamples, initCustomer } from "./customerEntry";

const app = express();

app.use(cors());

app.get("/", (req, res) => res.status(200).send("Hey there!"));

app.post("/initStat", initStat);
app.post("/meal", initMeal);
app.post("/customer", initCustomer);

app.post("/addOrder", addOrder);
app.post("/updateOrder", updateOrder);
app.post("/cancelOrder", cancelOrder);

app.post("/getOrder", getOrder);
app.get("/customers", getCustomerSamples);
app.get("/stat", getStat);
app.get("/mealStat", getMealStatSamples);
exports.app = functions.https.onRequest(app);
