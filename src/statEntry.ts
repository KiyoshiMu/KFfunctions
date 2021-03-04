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
      Income: admin.firestore.FieldValue.increment(updateIncome),
      Orders: admin.firestore.FieldValue.increment(updateOrder),
    });
  } catch (error) {
    if (error.code === 5) {
      stat.set({ Income: updateIncome, Orders: updateOrder }, { merge: true });
    } else {
      throw error;
    }
  }
};

const weekStatUpdate = async (
  stat: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>,
  { updateIncome, updateOrder, weekMark: week }: statUpdate
) => {
  try {
    await stat.update({
      Income: admin.firestore.FieldValue.increment(updateIncome),
      Orders: admin.firestore.FieldValue.increment(updateOrder),
    });
  } catch (error) {
    if (error.code === 5) {
      stat.set(
        { Income: updateIncome, Orders: updateOrder, week: week },
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
        Id: e.Id,
        name: e.Name,
        size: e.Size,
        price: e.PiecePrice,
        quantityChange: e.Quantity,
        incomeChange: e.PiecePrice * e.Quantity,
      })
  );

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
export { updateStat, getStat };
