import { Activity, GlobalData, Product, VoteOption, Order, BeanTransaction } from '../types';

const STORAGE_KEYS = {
  ACTIVITIES: 'trae_activities',
  GLOBAL_DATA: 'trae_global_data',
};

// Initial Seed Data (extracted from original SpringEquinoxV2.tsx)
const INITIAL_VOTE_OPTIONS: VoteOption[] = [
  { 
    id: '1', 
    name: '水煮蛋', 
    votes: 2341, 
    imageUrl: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=delicious%20boiled%20egg%20cut%20in%20half%20watercolor%20illustration%20minimalist%20white%20background&image_size=square', 
    color: 'from-orange-100 to-yellow-100' 
  },
  { 
    id: '2', 
    name: '溏心蛋', 
    votes: 1892, 
    imageUrl: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=sunny%20side%20up%20fried%20egg%20watercolor%20illustration%20appetizing%20white%20background&image_size=square', 
    color: 'from-yellow-100 to-orange-100' 
  },
  { 
    id: '3', 
    name: '鸡蛋灌饼', 
    votes: 1567, 
    imageUrl: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=chinese%20egg%20pancake%20jianbing%20watercolor%20illustration%20street%20food%20white%20background&image_size=square', 
    color: 'from-amber-100 to-orange-100' 
  },
  { 
    id: '4', 
    name: '酱香鸡蛋', 
    votes: 1023, 
    imageUrl: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=soy%20sauce%20marinated%20egg%20watercolor%20illustration%20rich%20color%20white%20background&image_size=square', 
    color: 'from-red-100 to-orange-100' 
  },
  { 
    id: '5', 
    name: '我来推荐', 
    votes: 876, 
    imageUrl: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=chinese%20writing%20brush%20and%20ink%20stone%20watercolor%20illustration%20minimalist%20white%20background&image_size=square', 
    color: 'from-green-100 to-emerald-100' 
  },
];

const INITIAL_FOODS: Product[] = [
  { id: 'f1', type: 'food', name: '鲜嫩春笋', subtitle: '山野之鲜', description: '春日限定美味', price: 28.8, currency: 'cny', images: ['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=fresh%20spring%20bamboo%20shoots%20high%20quality%20photography&image_size=square'], displayOrder: 1, isActive: true, createdAt: new Date().toISOString() },
  { id: 'f2', type: 'food', name: '红油香椿', subtitle: '时令野菜', description: '一口春天的味道', price: 38.8, currency: 'cny', images: ['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=fresh%20chinese%20toon%20sprouts%20vegetable%20photography&image_size=square'], displayOrder: 2, isActive: true, createdAt: new Date().toISOString() },
  { id: 'f3', type: 'food', name: '野生荠菜', subtitle: '鲜香可口', description: '鲜美包饺子', price: 18.8, currency: 'cny', images: ['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=fresh%20shepherd%27s%20purse%20green%20vegetable%20basket&image_size=square'], displayOrder: 3, isActive: true, createdAt: new Date().toISOString() },
];

const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', type: 'merchandise', name: '智能煮蛋器', subtitle: '自动断电', description: '精准控温', price: 59.9, currency: 'cny', images: ['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern%20white%20egg%20cooker%20appliance%20minimalist&image_size=square'], displayOrder: 1, isActive: true, createdAt: new Date().toISOString() },
  { id: 'p2', type: 'merchandise', name: '春日野餐垫', subtitle: '加厚防潮', description: '防水加厚', price: 89.9, currency: 'cny', images: ['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=picnic%20mat%20on%20green%20grass%20spring%20outdoor&image_size=square'], displayOrder: 2, isActive: true, createdAt: new Date().toISOString() },
  { id: 'p3', type: 'merchandise', name: '陶瓷蛋托', subtitle: '可爱造型', description: '创意收纳', price: 29.9, currency: 'cny', images: ['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ceramic%20egg%20holder%20tray%20cute%20design&image_size=square'], displayOrder: 3, isActive: true, createdAt: new Date().toISOString() },
];

const INITIAL_SPOTS: Product[] = [
  { id: 's1', type: 'spot', name: '苏州赏花指南', description: '十里桃花映春风', tags: ['热门'], price: 0, currency: 'cny', images: ['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=suzhou%20garden%20cherry%20blossom%20spring%20scenery&image_size=landscape_16_9'], displayOrder: 1, isActive: true, createdAt: new Date().toISOString() },
  { id: 's2', type: 'spot', name: '非遗立蛋体验', description: '亲子互动好去处', tags: ['推荐'], price: 0, currency: 'cny', images: ['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=children%20playing%20egg%20balancing%20game%20happy%20spring&image_size=landscape_16_9'], displayOrder: 2, isActive: true, createdAt: new Date().toISOString() },
  { id: 's3', type: 'spot', name: '阳澄湖踏青', description: '湖光春色两相宜', tags: ['新品'], price: 0, currency: 'cny', images: ['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=yangcheng%20lake%20spring%20scenery%20green%20grass%20blue%20water&image_size=landscape_16_9'], displayOrder: 3, isActive: true, createdAt: new Date().toISOString() },
];

const INITIAL_SHOP_PRODUCTS: Product[] = [
  { id: 'sp1', type: 'merchandise', name: '春分限定帆布袋', description: '限量版', price: 500, currency: 'beans', stock: 20, images: ['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=canvas%20tote%20bag%20with%20spring%20equinox%20illustration%20minimalist%20mockup&image_size=square'], displayOrder: 1, isActive: true, createdAt: new Date().toISOString() },
  { id: 'sp2', type: 'merchandise', name: '非遗手工风筝', description: '传统工艺', price: 800, currency: 'beans', stock: 5, images: ['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=traditional%20chinese%20kite%20swallow%20design%20colorful%20handcrafted&image_size=square'], displayOrder: 2, isActive: true, createdAt: new Date().toISOString() },
  { id: 'sp3', type: 'merchandise', name: '有机绿茶礼盒', description: '明前龙井', price: 1200, currency: 'beans', stock: 10, images: ['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=premium%20green%20tea%20gift%20box%20elegant%20packaging%20spring%20tea&image_size=square'], displayOrder: 3, isActive: true, createdAt: new Date().toISOString() },
  { id: 'sp4', type: 'merchandise', name: '立蛋挑战纪念章', description: '金属徽章', price: 300, currency: 'beans', stock: 50, images: ['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=metal%20badge%20pin%20egg%20balancing%20design%20gold%20finish&image_size=square'], displayOrder: 4, isActive: true, createdAt: new Date().toISOString() },
];

const INITIAL_ACTIVITY: Activity = {
  id: 'spring_equinox_2024',
  name: '春分到，蛋儿俏',
  subtitle: '春色正中分，美好正当时',
  termType: 'chunfen',
  startTime: '2024-03-20',
  endTime: '2024-03-22',
  theme: 'ink',
  interaction: {
    type: 'vote',
    voteOptions: INITIAL_VOTE_OPTIONS
  },
  recommendedFoods: INITIAL_FOODS,
  recommendedProducts: INITIAL_PRODUCTS,
  recommendedSpots: INITIAL_SPOTS,
  isActive: true
};

class DataManager {
  private activities: Activity[] = [];
  private globalData: GlobalData = {
    shopProducts: [],
    userBeans: 100,
    transactions: [],
    orders: []
  };

  constructor() {
    this.load();
  }

  private load() {
    const savedActivities = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    const savedGlobal = localStorage.getItem(STORAGE_KEYS.GLOBAL_DATA);

    if (savedActivities) {
      this.activities = JSON.parse(savedActivities);
      // Migration: Update name if it's the old default
      if (this.activities[0]?.id === 'spring_equinox_2024') {
        let needsSave = false;
        
        // 1. Update Title/Subtitle if needed
        if (this.activities[0].name === '春分·竖蛋') {
            this.activities[0].name = '春分到，蛋儿俏';
            this.activities[0].subtitle = '春色正中分，美好正当时';
            needsSave = true;
        }

        // 2. Migration: Backfill subtitles for Recommended Foods
        if (this.activities[0].recommendedFoods) {
            this.activities[0].recommendedFoods.forEach(food => {
                if (!food.subtitle) {
                    const defaultItem = INITIAL_FOODS.find(f => f.id === food.id);
                    if (defaultItem?.subtitle) {
                        food.subtitle = defaultItem.subtitle;
                        needsSave = true;
                    }
                }
            });
        }

        // 3. Migration: Backfill subtitles for Recommended Products
        if (this.activities[0].recommendedProducts) {
            this.activities[0].recommendedProducts.forEach(prod => {
                if (!prod.subtitle) {
                    const defaultItem = INITIAL_PRODUCTS.find(p => p.id === prod.id);
                    if (defaultItem?.subtitle) {
                        prod.subtitle = defaultItem.subtitle;
                        needsSave = true;
                    }
                }
            });
        }

        if (needsSave) {
            this.saveActivities();
        }
      }
    } else {
      this.activities = [INITIAL_ACTIVITY];
      this.saveActivities();
    }

    if (savedGlobal) {
      this.globalData = JSON.parse(savedGlobal);
    } else {
      this.globalData = {
        shopProducts: INITIAL_SHOP_PRODUCTS,
        userBeans: 100,
        transactions: [{ id: '1', type: 'income', source: '首次登录', amount: 100, time: new Date().toLocaleString() }],
        orders: []
      };
      this.saveGlobal();
    }
  }

  private saveActivities() {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(this.activities));
  }

  private saveGlobal() {
    localStorage.setItem(STORAGE_KEYS.GLOBAL_DATA, JSON.stringify(this.globalData));
  }

  // --- Activity Methods ---
  
  getActivities(): Activity[] {
    return this.activities;
  }

  getActivity(id: string): Activity | undefined {
    return this.activities.find(a => a.id === id);
  }

  saveActivity(activity: Activity) {
    const index = this.activities.findIndex(a => a.id === activity.id);
    if (index >= 0) {
      this.activities[index] = activity;
    } else {
      this.activities.push(activity);
    }
    this.saveActivities();
  }

  deleteActivity(id: string) {
    this.activities = this.activities.filter(a => a.id !== id);
    this.saveActivities();
  }

  // --- Global Shop Methods ---

  getShopProducts(): Product[] {
    return this.globalData.shopProducts;
  }

  saveShopProduct(product: Product) {
    const list = this.globalData.shopProducts;
    const index = list.findIndex(p => p.id === product.id);
    if (index >= 0) {
      list[index] = product;
    } else {
      list.push(product);
    }
    this.saveGlobal();
  }

  deleteShopProduct(id: string) {
    this.globalData.shopProducts = this.globalData.shopProducts.filter(p => p.id !== id);
    this.saveGlobal();
  }

  // --- User Methods ---

  getUserBeans(): number {
    return this.globalData.userBeans;
  }

  getTransactions(): BeanTransaction[] {
    return this.globalData.transactions;
  }

  addBeans(amount: number, source: string) {
    this.globalData.userBeans += amount;
    this.globalData.transactions.unshift({
      id: Date.now().toString(),
      type: 'income',
      amount,
      source,
      time: new Date().toLocaleString()
    });
    this.saveGlobal();
  }

  redeemProduct(product: Product, address: any): boolean {
    if (this.globalData.userBeans < product.price) return false;

    // Deduct beans
    this.globalData.userBeans -= product.price;
    this.globalData.transactions.unshift({
      id: Date.now().toString(),
      type: 'expense',
      amount: product.price,
      source: `兑换-${product.name}`,
      time: new Date().toLocaleString()
    });

    // Create Order
    this.globalData.orders.unshift({
      id: Date.now().toString(),
      userId: 'user_1',
      type: 'redeem',
      productName: product.name,
      amount: product.price,
      status: 'pending',
      address,
      time: new Date().toLocaleString()
    });

    // Deduct Stock
    if (product.stock && product.stock > 0) {
        const globalProd = this.globalData.shopProducts.find(p => p.id === product.id);
        if (globalProd && globalProd.stock) {
            globalProd.stock -= 1;
        }
    }

    this.saveGlobal();
    return true;
  }

  recordLotteryWin(prizeType: 'eggs' | 'beans', amount: number, address?: any) {
    if (prizeType === 'beans') {
        this.addBeans(amount, '幸运抽奖');
    } else if (prizeType === 'eggs') {
        // Create a special order for the prize
        this.globalData.orders.unshift({
            id: Date.now().toString(),
            userId: 'user_1',
            type: 'lottery',
            productName: '春分好运鸡蛋 (抽奖)',
            amount: 0, // Free
            status: 'pending',
            address,
            time: new Date().toLocaleString()
        });
        this.saveGlobal();
    }
  }
  
  getOrders(): Order[] {
    return this.globalData.orders;
  }
}

export const dataManager = new DataManager();
