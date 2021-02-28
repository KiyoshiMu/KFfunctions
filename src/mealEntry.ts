import { db } from "./config/firebase";
import { Response } from "express";
import { Meal } from "./model/meal";

type Request = {
  body: Meal;
  params: { mealId: string };
};

const initMeal = async (req: Request, res: Response) => {
  try {
    const meal = req.body;
    await db.collection("mealStat").doc(meal.Name).set(meal);
    res.status(200).send({
      status: "success",
      message: "Meal init successfully",
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export { initMeal };
