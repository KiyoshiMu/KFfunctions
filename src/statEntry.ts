import { db, admin } from "./config/firebase";
import { Response } from "express";
import { Item } from "./model/order";
import { MealUpdate } from "./model/meal";

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

const updateStat = async (
  updateIncome: number,
  updateOrder: number,
  items: Array<Item>
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

  items.forEach(
    async (e) =>
      await updateMealStat({
        Id: e.Id,
        name: e.Name,
        size: e.Size,
        price: e["Piece Price"],
        quantityChange: e.Quantity,
        incomeChange: e["Piece Price"] * e.Quantity,
      })
  );
};

const updateMealStat = async (mealUpdate: MealUpdate) => {
  const mealStatRef = db.collection("mealStat").doc(mealUpdate.Id);
  try {
    await mealStatRef.update({
      totalOrder: admin.firestore.FieldValue.increment(
        mealUpdate.quantityChange
      ),
      weeklyOrder: admin.firestore.FieldValue.increment(
        mealUpdate.quantityChange
      ),
      weeklyIncome: admin.firestore.FieldValue.increment(
        mealUpdate.incomeChange
      ),
      totalIncome: admin.firestore.FieldValue.increment(
        mealUpdate.incomeChange
      ),
    });
  } catch (error) {
    if (error.code === 5) {
      mealStatRef.set(
        {
          name: mealUpdate.name,
          size: mealUpdate.size,
          price: mealUpdate.price,
          totalOrder: mealUpdate.quantityChange,
          weeklyOrder: mealUpdate.quantityChange,
          weeklyIncome: mealUpdate.incomeChange,
          totalIncome: mealUpdate.incomeChange,
        },
        { merge: true }
      );
    } else {
      throw error;
    }
  }
};
export { initStat, updateStat, getStat };
