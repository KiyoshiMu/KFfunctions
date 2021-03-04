import { db, admin } from "./config/firebase";
import { Response } from "express";
import { Item } from "./model/order";
import { MealUpdate } from "./model/meal";

type Request = {
  params: { Id: string };
};

const getStat = async (req: Request, res: Response) => {
  try {
    const stat = (
      await db.collection("saleStat").doc("realtimeStat").get()
    ).data();
    return res.status(200).json(stat);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

interface statUpdate {
  updateIncome: number;
  updateOrder: number;
  weekMark: number;
}

const updateStat = async (statUpdate: statUpdate, items: Item[]) => {
  const { weekMark } = statUpdate;
  const totalStat = db.collection("saleStat").doc("realtimeStat");
  const weekStat = totalStat.collection("weekly").doc(weekMark.toString());
  await overStatUpdate(totalStat, statUpdate);
  await weekStatUpdate(weekStat, statUpdate);
  itemStatUpdate(items);
};

const overStatUpdate = async (
  stat: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>,
  { updateIncome, updateOrder }: statUpdate
) => {
  try {
    await stat.update({
      income: admin.firestore.FieldValue.increment(updateIncome),
      orders: admin.firestore.FieldValue.increment(updateOrder),
    });
  } catch (error) {
    if (error.code === 5) {
      stat.set({ income: updateIncome, orders: updateOrder }, { merge: true });
    } else {
      throw error;
    }
  }
};

const weekStatUpdate = async (
  stat: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>,
  { updateIncome, updateOrder, weekMark }: statUpdate
) => {
  try {
    await stat.update({
      income: admin.firestore.FieldValue.increment(updateIncome),
      orders: admin.firestore.FieldValue.increment(updateOrder),
    });
  } catch (error) {
    if (error.code === 5) {
      stat.set(
        { income: updateIncome, orders: updateOrder, weekMark: weekMark },
        { merge: true }
      );
    } else {
      throw error;
    }
  }
};

const itemStatUpdate = (items: Item[]) =>
  items.forEach(
    async (e) =>
      await updateMealStat({
        mealId: e.mealId,
        quantityChange: e.quantity,
        incomeChange: e.piecePrice * e.quantity,
      })
  );

const updateMealStat = async (mealUpdate: MealUpdate) => {
  const mealStatRef = db.collection("meals").doc(mealUpdate.mealId);
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
export { updateStat, getStat };
