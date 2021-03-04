import { db } from "./config/firebase";
import { Response } from "express";
import { MealUnit } from "./model/meal";

type Request = {
  body: MealUnit;
};

const getMeals = async (req: Request, res: Response) => {
  try {
    const mealStats = db.collection("meals").where("sale", "==", true);
    const docs = (await mealStats.get()).docs.map((doc) => doc.data());
    return res.status(200).json(docs);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export { getMeals };
