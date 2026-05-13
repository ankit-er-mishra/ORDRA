import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

function hash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex').slice(0, 16);
}

async function main() {
  console.log('🌱 Seeding Ordra database...');

  // Clear existing data
  await prisma.ledgerEntry.deleteMany();
  await prisma.orderEvent.deleteMany();
  await prisma.order.deleteMany();
  await prisma.sellerProfile.deleteMany();

  // Create seller profiles
  const sellers = await Promise.all([
    prisma.sellerProfile.create({
      data: {
        sellerId: 'SELLER-001',
        name: 'TechVista Electronics',
        location: 'Delhi NCR',
        reliabilityScore: 4.8,
        totalOrders: 15420,
        verified: true,
      },
    }),
    prisma.sellerProfile.create({
      data: {
        sellerId: 'SELLER-002',
        name: 'SneakerHub India',
        location: 'Mumbai',
        reliabilityScore: 4.6,
        totalOrders: 8930,
        verified: true,
      },
    }),
    prisma.sellerProfile.create({
      data: {
        sellerId: 'SELLER-003',
        name: 'HomeAppliance Pro',
        location: 'Bangalore',
        reliabilityScore: 4.9,
        totalOrders: 22150,
        verified: true,
      },
    }),
    prisma.sellerProfile.create({
      data: {
        sellerId: 'SELLER-004',
        name: 'FashionStreet Official',
        location: 'Hyderabad',
        reliabilityScore: 4.4,
        totalOrders: 5670,
        verified: true,
      },
    }),
    prisma.sellerProfile.create({
      data: {
        sellerId: 'SELLER-005',
        name: 'MacWorld Store',
        location: 'Delhi NCR',
        reliabilityScore: 4.9,
        totalOrders: 31200,
        verified: true,
      },
    }),
  ]);

  const now = new Date();
  const baseTime = new Date(now.getTime() - 30 * 60 * 1000); // 30 min ago

  const stages = [
    'payment_verified',
    'inventory_reserved',
    'seller_acknowledged',
    'package_secured',
    'courier_pickup',
    'in_transit',
    'out_for_delivery',
    'delivered',
  ];

  const stageLabels: Record<string, string> = {
    payment_verified: 'Payment Verified',
    inventory_reserved: 'Inventory Reserved',
    seller_acknowledged: 'Seller Acknowledged',
    package_secured: 'Package Secured',
    courier_pickup: 'Courier Pickup Pending',
    in_transit: 'In Transit',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
  };

  const stageNotes: Record<string, string> = {
    payment_verified: 'Your payment has been securely verified.',
    inventory_reserved: 'Item has been reserved in our warehouse.',
    seller_acknowledged: 'Seller has confirmed and committed your item for dispatch.',
    package_secured: 'Your item is carefully packed and verified by seller.',
    courier_pickup: 'Waiting for courier partner to pick up the package.',
    in_transit: 'Your package is on its way to you.',
    out_for_delivery: 'Your package is out for delivery.',
    delivered: 'Your package will be delivered soon.',
  };

  const stageVerifiers: Record<string, string> = {
    payment_verified: 'Razorpay',
    inventory_reserved: 'Warehouse System',
    seller_acknowledged: 'Seller System',
    package_secured: 'Seller Verified',
    courier_pickup: 'Courier System',
    in_transit: 'Logistics Partner',
    out_for_delivery: 'Delivery Partner',
    delivered: 'Delivery Confirmed',
  };

  // Order 1 — Samsung Galaxy S24 Ultra (partially progressed — 4 stages done)
  const order1 = await prisma.order.create({
    data: {
      orderId: 'ORD-2024-7891',
      platform: 'Ordra Demo',
      productName: 'Samsung Galaxy S24 Ultra 256GB — Titanium Black',
      sellerName: 'TechVista Electronics',
      sellerId: 'SELLER-001',
      amount: 129999,
      currency: 'INR',
      paymentMethod: 'UPI — Google Pay',
      customerEmail: 'ankit@example.com',
      customerName: 'Ankit Mishra',
      estimatedDelivery: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      confidenceScore: 92,
      emotionalState: 'NORMAL',
      currentStage: 'package_secured',
    },
  });

  // Create events for order 1 (first 4 completed, rest pending)
  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i];
    let status = 'PENDING';
    let timestamp = now;

    if (i < 3) {
      status = 'COMPLETED';
      timestamp = new Date(baseTime.getTime() + i * 2 * 60 * 1000);
    } else if (i === 3) {
      status = 'IN_PROGRESS';
      timestamp = new Date(baseTime.getTime() + i * 2 * 60 * 1000);
    }

    const proofData = stage === 'seller_acknowledged' && status === 'COMPLETED' ? {
      sellerCommitment: true,
      acknowledgedAt: new Date(baseTime.getTime() + 2 * 2 * 60 * 1000).toISOString(),
      sellerReliability: 4.8,
      packagingInitiated: true,
    } : null;

    await prisma.orderEvent.create({
      data: {
        orderId: 'ORD-2024-7891',
        stage,
        status,
        timestamp: status !== 'PENDING' ? timestamp : now,
        verifiedBy: status !== 'PENDING' ? stageVerifiers[stage] : null,
        proofData,
        notes: stageNotes[stage],
        sortOrder: i,
      },
    });

    if (status === 'COMPLETED' || status === 'IN_PROGRESS') {
      await prisma.ledgerEntry.create({
        data: {
          orderId: 'ORD-2024-7891',
          eventType: stageLabels[stage],
          description: stageNotes[stage],
          timestamp,
          verifiedBy: stageVerifiers[stage],
          verificationHash: hash(`ORD-2024-7891-${stage}-${timestamp.toISOString()}`),
        },
      });
    }
  }

  // Protection Activated ledger entry
  await prisma.ledgerEntry.create({
    data: {
      orderId: 'ORD-2024-7891',
      eventType: 'Protection Activated',
      description: 'Ordra buyer protection has been activated for this order.',
      timestamp: new Date(baseTime.getTime() + 9 * 60 * 1000),
      verifiedBy: 'Ordra Security',
      verificationHash: hash(`ORD-2024-7891-protection-${now.toISOString()}`),
    },
  });

  // Order 2 — Nike Air Max (early stage — 2 stages done)
  const order2 = await prisma.order.create({
    data: {
      orderId: 'ORD-2024-7892',
      platform: 'Ordra Demo',
      productName: 'Nike Air Max 270 React — White/Black',
      sellerName: 'SneakerHub India',
      sellerId: 'SELLER-002',
      amount: 12499,
      currency: 'INR',
      paymentMethod: 'Credit Card — HDFC',
      customerEmail: 'priya@example.com',
      customerName: 'Priya Sharma',
      estimatedDelivery: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      confidenceScore: 88,
      emotionalState: 'NORMAL',
      currentStage: 'inventory_reserved',
    },
  });

  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i];
    let status = 'PENDING';
    let timestamp = now;
    if (i < 2) {
      status = 'COMPLETED';
      timestamp = new Date(baseTime.getTime() + i * 2 * 60 * 1000);
    } else if (i === 2) {
      status = 'IN_PROGRESS';
      timestamp = now;
    }

    await prisma.orderEvent.create({
      data: {
        orderId: 'ORD-2024-7892',
        stage,
        status,
        timestamp: status !== 'PENDING' ? timestamp : now,
        verifiedBy: status !== 'PENDING' ? stageVerifiers[stage] : null,
        notes: stageNotes[stage],
        sortOrder: i,
      },
    });

    if (status === 'COMPLETED') {
      await prisma.ledgerEntry.create({
        data: {
          orderId: 'ORD-2024-7892',
          eventType: stageLabels[stage],
          description: stageNotes[stage],
          timestamp,
          verifiedBy: stageVerifiers[stage],
          verificationHash: hash(`ORD-2024-7892-${stage}-${timestamp.toISOString()}`),
        },
      });
    }
  }

  // Order 3 — Bosch Washing Machine (just started — 1 stage done)
  const order3 = await prisma.order.create({
    data: {
      orderId: 'ORD-2024-7893',
      platform: 'Ordra Demo',
      productName: 'Bosch 7kg Front Load Washing Machine — Silver',
      sellerName: 'HomeAppliance Pro',
      sellerId: 'SELLER-003',
      amount: 34999,
      currency: 'INR',
      paymentMethod: 'Net Banking — SBI',
      customerEmail: 'rahul@example.com',
      customerName: 'Rahul Patel',
      estimatedDelivery: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      confidenceScore: 95,
      emotionalState: 'NORMAL',
      currentStage: 'payment_verified',
    },
  });

  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i];
    let status = 'PENDING';
    let timestamp = now;
    if (i === 0) {
      status = 'COMPLETED';
      timestamp = new Date(baseTime.getTime());
    } else if (i === 1) {
      status = 'IN_PROGRESS';
      timestamp = now;
    }

    await prisma.orderEvent.create({
      data: {
        orderId: 'ORD-2024-7893',
        stage,
        status,
        timestamp: status !== 'PENDING' ? timestamp : now,
        verifiedBy: status !== 'PENDING' ? stageVerifiers[stage] : null,
        notes: stageNotes[stage],
        sortOrder: i,
      },
    });

    if (status === 'COMPLETED') {
      await prisma.ledgerEntry.create({
        data: {
          orderId: 'ORD-2024-7893',
          eventType: stageLabels[stage],
          description: stageNotes[stage],
          timestamp,
          verifiedBy: stageVerifiers[stage],
          verificationHash: hash(`ORD-2024-7893-${stage}-${timestamp.toISOString()}`),
        },
      });
    }
  }

  // Order 4 — Levi's Denim Jacket (attention state — delay)
  const order4 = await prisma.order.create({
    data: {
      orderId: 'ORD-2024-7894',
      platform: 'Ordra Demo',
      productName: "Levi's Trucker Denim Jacket — Indigo",
      sellerName: 'FashionStreet Official',
      sellerId: 'SELLER-004',
      amount: 4299,
      currency: 'INR',
      paymentMethod: 'UPI — PhonePe',
      customerEmail: 'sneha@example.com',
      customerName: 'Sneha Reddy',
      estimatedDelivery: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      confidenceScore: 74,
      emotionalState: 'ATTENTION',
      currentStage: 'courier_pickup',
    },
  });

  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i];
    let status = 'PENDING';
    let timestamp = now;
    if (i < 4) {
      status = 'COMPLETED';
      timestamp = new Date(baseTime.getTime() + i * 3 * 60 * 1000);
    } else if (i === 4) {
      status = 'IN_PROGRESS';
      timestamp = new Date(baseTime.getTime() + 15 * 60 * 1000);
    }

    await prisma.orderEvent.create({
      data: {
        orderId: 'ORD-2024-7894',
        stage,
        status,
        timestamp: status !== 'PENDING' ? timestamp : now,
        verifiedBy: status !== 'PENDING' ? stageVerifiers[stage] : null,
        notes: stage === 'courier_pickup' && status === 'IN_PROGRESS'
          ? 'Courier allocation taking slightly longer than usual.'
          : stageNotes[stage],
        sortOrder: i,
      },
    });

    if (status === 'COMPLETED' || status === 'IN_PROGRESS') {
      await prisma.ledgerEntry.create({
        data: {
          orderId: 'ORD-2024-7894',
          eventType: stageLabels[stage],
          description: stageNotes[stage],
          timestamp: status !== 'PENDING' ? timestamp : now,
          verifiedBy: stageVerifiers[stage],
          verificationHash: hash(`ORD-2024-7894-${stage}-${timestamp.toISOString()}`),
        },
      });
    }
  }

  // Order 5 — MacBook Air M3 (fully delivered)
  const order5 = await prisma.order.create({
    data: {
      orderId: 'ORD-2024-7895',
      platform: 'Ordra Demo',
      productName: 'Apple MacBook Air M3 15" — Midnight 256GB',
      sellerName: 'MacWorld Store',
      sellerId: 'SELLER-005',
      amount: 114900,
      currency: 'INR',
      paymentMethod: 'EMI — ICICI Credit Card',
      customerEmail: 'vikram@example.com',
      customerName: 'Vikram Singh',
      estimatedDelivery: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      confidenceScore: 100,
      emotionalState: 'NORMAL',
      currentStage: 'delivered',
    },
  });

  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i];
    const timestamp = new Date(baseTime.getTime() - (8 - i) * 60 * 60 * 1000);

    await prisma.orderEvent.create({
      data: {
        orderId: 'ORD-2024-7895',
        stage,
        status: 'COMPLETED',
        timestamp,
        verifiedBy: stageVerifiers[stage],
        notes: stageNotes[stage],
        sortOrder: i,
      },
    });

    await prisma.ledgerEntry.create({
      data: {
        orderId: 'ORD-2024-7895',
        eventType: stageLabels[stage],
        description: stageNotes[stage],
        timestamp,
        verifiedBy: stageVerifiers[stage],
        verificationHash: hash(`ORD-2024-7895-${stage}-${timestamp.toISOString()}`),
      },
    });
  }

  console.log('✅ Seeded 5 seller profiles');
  console.log('✅ Seeded 5 demo orders with events and ledger entries');
  console.log('');
  console.log('Demo orders:');
  console.log('  ORD-2024-7891 — Samsung Galaxy S24 Ultra (4/8 stages)');
  console.log('  ORD-2024-7892 — Nike Air Max 270 (2/8 stages)');
  console.log('  ORD-2024-7893 — Bosch Washing Machine (1/8 stages)');
  console.log('  ORD-2024-7894 — Levi\'s Denim Jacket (5/8, ATTENTION state)');
  console.log('  ORD-2024-7895 — MacBook Air M3 (Delivered ✅)');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
