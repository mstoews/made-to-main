import { Timestamp } from 'firebase/firestore';
import { Comments } from './comment.model';


export interface Blog {
  id: string;
  description: string;
  longDescription: string;
  iconUrl: string;
  categories: string[];
  comments: Comments[]
  likeCount: number;
  promo: boolean;
  promoStartAt: Timestamp;
}

