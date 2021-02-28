import { db, admin } from "./config/firebase";
import { Response } from "express";

type Request = {
  params: { Id: string };
};

const getStat = async (req: Request, res: Response) => {
  try {
    const stat = await (
      await db.collection("saleStat").doc("realtimeStat").get()
    ).data();
    return res.status(200).json(stat);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const initStat = async (req: Request, res: Response) => {
  try {
    await db
      .collection("saleStat")
      .doc("realtimeStat")
      .set({}, { merge: true });
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
  try {
    await saleStat.update({
      Income: admin.firestore.FieldValue.increment(updateIncome),
      Orders: admin.firestore.FieldValue.increment(updateOrder),
    });
  } catch (error) {
    if (error.code === 5) {
      saleStat.set(
        {
          Income: updateIncome,
          Orders: updateOrder,
        },
        { merge: true }
      );
    } else {
      throw error;
    }
  }
  updateMeal.forEach(async (e) => await updateMealStat(e));
};

const updateMealStat = async (mealUpdate: mealUpdate) => {
  const mealStatRef = db.collection("mealStat").doc(mealUpdate.Name);
  try {
    await mealStatRef.update({
      Quantity: admin.firestore.FieldValue.increment(mealUpdate.Quantity),
    });
  } catch (error) {
    if (error.code === 5) {
      mealStatRef.set(
        {
          Name: mealUpdate.Name,
          Quantity: mealUpdate.Quantity,
        },
        { merge: true }
      );
    } else {
      throw error;
    }
  }
};
export { initStat, updateStat, getStat };
