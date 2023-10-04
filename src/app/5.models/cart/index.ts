import { FieldValue } from "firebase/firestore";

export interface Cart {
  id: string;
  product_id:   string;
  description:  string;
  image:        string;
  price:        number;
  category:     string;
  is_completed:  boolean;
  user_purchased: string;
  date_sold: FieldValue;
  date_updated: FieldValue;
  quantity_required: boolean;
  quantity: number;
  status: string;
}
