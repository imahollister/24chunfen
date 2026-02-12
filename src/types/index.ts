export interface Product {
  id: string;
  type: 'food' | 'merchandise' | 'spot' | 'digital';
  name: string;
  subtitle?: string; // New subtitle field for product cards
  description: string;
  images: string[];
  price: number; // For shop items (beans) or display price (CNY)
  currency: 'cny' | 'beans';
  stock?: number; // Only for shop items
  tags?: string[];
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface VoteOption {
  id: string;
  name: string;
  imageUrl: string;
  votes: number;
  color?: string; // Tailwind class
}

export interface Question {
  id: string;
  title: string;
  options: string[];
  correctIndex: number;
}

export interface InteractionConfig {
  type: 'vote' | 'quiz';
  voteOptions?: VoteOption[];
  questions?: Question[];
}

export interface Activity {
  id: string;
  name: string;
  subtitle?: string; // New subtitle field
  termType: string; // e.g. 'chunfen', 'xiazhi'
  startTime: string;
  endTime: string;
  theme: 'ink' | 'festive' | 'minimalist';
  
  // Interaction
  interaction: InteractionConfig;
  
  // Specific Resources for this activity
  recommendedFoods: Product[];
  recommendedProducts: Product[]; // Merchandise shown in activity
  recommendedSpots: Product[];
  
  isActive: boolean;
}

export interface BeanTransaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  source: string;
  time: string;
}

export interface Order {
  id: string;
  userId: string;
  type: 'redeem' | 'lottery'; // New field to distinguish source
  productName: string;
  amount: number;
  status: 'pending' | 'shipped';
  address?: {
    name: string;
    phone: string;
    address: string;
  };
  time: string;
}

export interface GlobalData {
  shopProducts: Product[]; // Global Beans Shop Inventory
  userBeans: number;
  transactions: BeanTransaction[];
  orders: Order[];
}
