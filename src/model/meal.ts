export interface MealUnit {
  Id: string;
  name: string;
  price: number;
  description?: string;
  size: string;
  cover?: string[];
  totalOrders?: number;
  weeklyOrders?: number;
}

export interface MealStat {
  name: string;
  size: string;
  weeklyOrders: number;
  totalOrders: number;
}

export interface MealUpdate {
  Id: string;
  name: string;
  size: string;
  price: number;
  quantityChange: number;
  incomeChange: number;
}
