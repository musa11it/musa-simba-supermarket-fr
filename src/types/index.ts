export type UserRole = 'superadmin' | 'admin' | 'staff' | 'customer';
export type Language = 'en' | 'rw' | 'fr';

export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  branchId?: string;
  language: Language;
  isActive: boolean;
  avatar?: string;
  noShowCount: number;
  createdAt: string;
}

export interface Branch {
  _id: string;
  name: string;
  nameRw: string;
  nameFr: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  openingHours: string;
  averageRating: number;
  totalReviews: number;
  // aliases used in some views
  rating?: number;
  reviewCount?: number;
  pendingApproval: boolean;
  isActive: boolean;
  rejectionReason?: string;
  managerIds?: string[];
  createdBy?: string;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  nameRw: string;
  nameFr: string;
  slug: string;
  icon: string;
  image?: string;
  order: number;
  isActive?: boolean;
}

export interface Product {
  _id: string;
  name: string;
  nameRw: string;
  nameFr: string;
  description: string;
  descriptionRw: string;
  descriptionFr: string;
  categoryId: string | Category;
  price: number;
  unit: string;
  image: string;
  images: string[];
  brand?: string;
  tags: string[];
  isFeatured: boolean;
  isActive?: boolean;
  stock?: number;
}

export interface CartItem {
  productId: string;
  name: string;
  nameRw: string;
  nameFr: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
}

export interface OrderItem {
  productId: string | Product;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerId: string | User;
  branchId: string | Branch;
  items: OrderItem[];
  subtotal: number;
  depositAmount: number;
  deposit?: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentConfirmed?: boolean;
  pickupTime: string;
  assignedStaffId?: string | User;
  note?: string;
  customerNote?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Review {
  _id: string;
  customerId: string | User;
  branchId: string | Branch;
  orderId: string | Order;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface Inventory {
  _id: string;
  productId: string | Product;
  branchId: string | Branch;
  stock: number;
  lowStockThreshold: number;
  isOutOfStock: boolean;
  updatedAt?: string;
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface OrderStats {
  todayOrders: number;
  pendingOrders: number;
  preparingOrders: number;
  completedToday: number;
  revenue: number;
  noShows: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
