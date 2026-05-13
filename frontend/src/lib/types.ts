export interface Order {
  id: string;
  orderId: string;
  platform: string;
  productName: string;
  productImage?: string;
  sellerName: string;
  sellerId?: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  customerEmail: string;
  customerName: string;
  estimatedDelivery: string;
  confidenceScore: number;
  emotionalState: 'NORMAL' | 'ATTENTION' | 'ACTION_REQUIRED';
  currentStage: string;
  createdAt: string;
  updatedAt: string;
  events: OrderEvent[];
  ledgerEntries: LedgerEntry[];
  seller?: SellerProfile;
}

export interface OrderEvent {
  id: string;
  orderId: string;
  stage: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  timestamp: string;
  verifiedBy?: string;
  proofData?: {
    sellerCommitment?: boolean;
    acknowledgedAt?: string;
    sellerReliability?: number;
    packagingInitiated?: boolean;
  };
  notes?: string;
  sortOrder: number;
}

export interface LedgerEntry {
  id: string;
  orderId: string;
  eventType: string;
  description: string;
  timestamp: string;
  verifiedBy: string;
  verificationHash: string;
}

export interface SellerProfile {
  id: string;
  sellerId: string;
  name: string;
  location?: string;
  reliabilityScore: number;
  totalOrders: number;
  verified: boolean;
}

export interface ConfidenceData {
  orderId: string;
  confidenceScore: number;
  confidenceLabel: string;
  estimatedDelivery?: string;
  emotionalState?: string;
  currentStage?: string;
  prediction?: {
    estimatedDelivery: string;
    onTrack: boolean;
  };
}

export const STAGE_CONFIG: Record<string, { label: string; description: string; icon: string }> = {
  payment_verified: { label: 'Payment Verified', description: 'Your payment has been securely verified.', icon: 'CreditCard' },
  inventory_reserved: { label: 'Inventory Reserved', description: 'Item has been reserved in our warehouse.', icon: 'Package' },
  seller_acknowledged: { label: 'Seller Acknowledged', description: 'Seller has confirmed and committed your item for dispatch.', icon: 'UserCheck' },
  package_secured: { label: 'Package Secured', description: 'Your item is carefully packed and verified by seller.', icon: 'BoxSelect' },
  courier_pickup: { label: 'Courier Pickup Pending', description: 'Waiting for courier partner to pick up the package.', icon: 'Truck' },
  in_transit: { label: 'In Transit', description: 'Your package is on its way to you.', icon: 'Navigation' },
  out_for_delivery: { label: 'Out for Delivery', description: 'Your package is out for delivery.', icon: 'MapPin' },
  delivered: { label: 'Delivered', description: 'Your package has been delivered successfully!', icon: 'CheckCircle' },
};

export const STAGE_VERIFIERS: Record<string, string> = {
  payment_verified: 'Razorpay',
  inventory_reserved: 'Warehouse System',
  seller_acknowledged: 'Seller System',
  package_secured: 'Seller Verified',
  courier_pickup: 'Courier System',
  in_transit: 'Logistics Partner',
  out_for_delivery: 'Delivery Partner',
  delivered: 'Delivery Confirmed',
};
