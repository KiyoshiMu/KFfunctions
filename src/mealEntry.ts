import { db } from "./config/firebase";
import { Response } from "express";
import { Meal } from "./model/meal";

type Request = {
  body: Meal;
  params: { mealId: string };
};

const getMealStatSamples = async (req: Request, res: Response) => {
  try {
    const mealStats = await db.collection("mealStat").limit(3);
    return res.status(200).json((await mealStats.get()).docs);
  } catch (error) {
    return res.status(500).json(error.message);
  }
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

export { initMeal, getMealStatSamples };
