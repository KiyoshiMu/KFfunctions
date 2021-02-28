import { db, admin } from "./config/firebase";
import { Response } from "express";

type Request = {
  params: { Id: string };
};

const initStat = async (req: Request, res: Response) => {
  try {
    await db.collection("saleStat").doc("realtimeStat").set({});
    res.status(200).send({
      status: "success",
      message: "Stat init successfully",
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

interface mealUpdate {
  Name: string;
  Quantity: number;
}

const updateStat = async (
  updateIncome: number,
  updateOrder: number,
  updateMeal: Array<mealUpdate>
) => {
  const saleStat = db.collection("saleStat").doc("realtimeStat");
  await saleStat.update({
    Income: admin.firestore.FieldValue.increment(updateIncome),
    Orders: admin.firestore.FieldValue.increment(updateOrder),
  });

  updateMeal.forEach(
    async (e) =>
      await db
        .collection("mealStat")
        .doc(e.Name)
        .update({ Quantity: admin.firestore.FieldValue.increment(e.Quantity) })
  );
};
export { initStat, updateStat };
