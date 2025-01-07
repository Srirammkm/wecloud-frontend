export interface StoragePlan {
  id: string;
  name: string;
  storage: string;
  price: number;
  features: string[];
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  plan: string;
  purchaseDate: Date;
  nextMaintenanceDate: Date;
  credentials?: {
    username: string;
    password: string;
  };
  paymentStatus: 'pending' | 'completed' | 'failed';
}

export interface PaymentDetails {
  orderId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  email: string;
  planId: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  firstName: string;
  lastName: string;
}

