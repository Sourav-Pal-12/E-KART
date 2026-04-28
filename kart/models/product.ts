import { ObjectId } from 'mongodb';

export interface MongoProduct {
  _id?: ObjectId;
  sanityId: string;
  name: string;
  slug: string;
  images?: string[];
  description?: string;
  price: number;
  discount: number;
  categories: string[];
  stock: number;
  brand?: string;
  status: 'new' | 'hot' | 'sale';
  variant: 'gadget' | 'appliances' | 'refrigerators' | 'others';
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MongoOrder {
  _id?: ObjectId;
  sanityId: string;
  orderNumber: string;
  clerkUserId: string;
  customerName: string;
  email: string;
  products: {
    productId: string;
    sanityProductId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  totalPrice: number;
  currency: string;
  amountDiscount: number;
  address: {
    state?: string;
    zip?: string;
    city?: string;
    address?: string;
    name?: string;
  };
  status: 'pending' | 'processing' | 'paid' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  orderDate: Date;
  stripeCheckoutSessionId?: string;
  stripePaymentIntentId?: string;
  stripeCustomerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MongoUser {
  _id?: ObjectId;
  clerkUserId: string;
  email: string;
  name: string;
  image?: string;
  addresses: {
    state?: string;
    zip?: string;
    city?: string;
    address?: string;
    name?: string;
  }[];
  wishlist: string[];
  createdAt: Date;
  updatedAt: Date;
}