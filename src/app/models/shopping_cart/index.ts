import { FieldValue } from "firebase/firestore";

export interface ShoppingCart {
  id: string;
  product_id:   string;
  description:   string;
  image:     string;
  price:        number;
  category:     string;
  rating:       string;
  is_completed:  boolean;
  user_purchased: string;
  date_sold: FieldValue;
  date_updated: FieldValue;
}
