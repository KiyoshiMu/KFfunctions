export interface MealUnit {
  mealId: string;
  name: string;
  price: number;
  cost?: number;
  description?: string;
  size: string;
  cover?: string[];
  totalOrders?: number;
  weeklyOrders?: number;
}

export interface MealStat {
  name: string;
  size: string;
  price: number;
  cost: number;
  weeklyOrder: number;
  totalOrder: number;
  totalIncome: number;
  weeklyIncome: number;
}

export interface MealUpdate {
  mealId: string;
  name: string;
  size: string;
  price: number;
  quantityChange: number;
  incomeChange: number;
}
