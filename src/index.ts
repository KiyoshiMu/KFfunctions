import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";
import { addOrder, cancelOrder, getOrder, updateOrder } from "./orderEntry";
import { getMeals } from "./mealEntry";
import { getStat } from "./statEntry";
import { getCustomer, initCustomer } from "./customerEntry";

const app = express();

app.use(cors());

app.post("/addCustomer", initCustomer);
app.post("/getCustomer", getCustomer);

app.post("/addOrder", addOrder);
app.post("/updateOrder", updateOrder);
app.post("/cancelOrder", cancelOrder);
app.post("/getOrder", getOrder);

app.get("/stat", getStat);
app.get("/meals", getMeals);
exports.app = functions.https.onRequest(app);
