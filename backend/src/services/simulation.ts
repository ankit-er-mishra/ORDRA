import { PrismaClient } from '@prisma/client';
import { Server } from 'socket.io';
import crypto from 'crypto';

const activeSimulations = new Map<string, NodeJS.Timeout>();

const stages = [
  'payment_verified', 'inventory_reserved', 'seller_acknowledged',
  'package_secured', 'courier_pickup', 'in_transit', 'out_for_delivery', 'delivered',
];

const stageLabels: Record<string, string> = {
  payment_verified: 'Payment Verified', inventory_reserved: 'Inventory Reserved',
  seller_acknowledged: 'Seller Acknowledged', package_secured: 'Package Secured',
  courier_pickup: 'Courier Pickup', in_transit: 'In Transit',
  out_for_delivery: 'Out for Delivery', delivered: 'Delivered',
};

const stageNotes: Record<string, string> = {
  payment_verified: 'Your payment has been securely verified.',
  inventory_reserved: 'Item has been reserved in our warehouse.',
  seller_acknowledged: 'Seller has confirmed and committed your item for dispatch.',
  package_secured: 'Your item is carefully packed and verified by seller.',
  courier_pickup: 'Courier partner has picked up the package.',
  in_transit: 'Your package is on its way to you.',
  out_for_delivery: 'Your package is out for delivery.',
  delivered: 'Your package has been delivered successfully!',
};

const stageVerifiers: Record<string, string> = {
  payment_verified: 'Razorpay', inventory_reserved: 'Warehouse System',
  seller_acknowledged: 'Seller System', package_secured: 'Seller Verified',
  courier_pickup: 'Courier System', in_transit: 'Logistics Partner',
  out_for_delivery: 'Delivery Partner', delivered: 'Delivery Confirmed',
};

const confidenceMap: Record<string, number> = {
  payment_verified: 72, inventory_reserved: 78, seller_acknowledged: 85,
  package_secured: 90, courier_pickup: 93, in_transit: 95,
  out_for_delivery: 98, delivered: 100,
};

function hash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex').slice(0, 16);
}

export function startSimulation(orderId: string, prisma: PrismaClient, io: Server, intervalMs: number): boolean {
  if (activeSimulations.has(orderId)) return false;

  const run = async () => {
    try {
      const events = await prisma.orderEvent.findMany({ where: { orderId }, orderBy: { sortOrder: 'asc' } });
      const inProg = events.find(e => e.status === 'IN_PROGRESS');
      const now = new Date();

      if (inProg) {
        const updated = await prisma.orderEvent.update({
          where: { id: inProg.id },
          data: {
            status: 'COMPLETED', timestamp: now,
            verifiedBy: stageVerifiers[inProg.stage], notes: stageNotes[inProg.stage],
            proofData: inProg.stage === 'seller_acknowledged' ? {
              sellerCommitment: true, acknowledgedAt: now.toISOString(),
              sellerReliability: 4.8, packagingInitiated: true,
            } : undefined,
          },
        });

        await prisma.ledgerEntry.create({
          data: {
            orderId, eventType: stageLabels[inProg.stage],
            description: stageNotes[inProg.stage], timestamp: now,
            verifiedBy: stageVerifiers[inProg.stage],
            verificationHash: hash(`${orderId}-${inProg.stage}-${now.toISOString()}`),
          },
        });

        const conf = confidenceMap[inProg.stage] || 85;
        await prisma.order.update({
          where: { orderId },
          data: { currentStage: inProg.stage, confidenceScore: conf, updatedAt: now },
        });

        io.to(`order:${orderId}`).emit('order:event', updated);
        io.to(`order:${orderId}`).emit('order:confidence', {
          orderId, confidenceScore: conf,
          confidenceLabel: conf >= 90 ? 'Very High' : conf >= 75 ? 'High' : 'Moderate',
        });

        const nextPending = events.find(e => e.status === 'PENDING' && e.sortOrder > inProg.sortOrder);
        if (nextPending) {
          const updNext = await prisma.orderEvent.update({
            where: { id: nextPending.id }, data: { status: 'IN_PROGRESS', timestamp: now },
          });
          io.to(`order:${orderId}`).emit('order:event', updNext);
        } else {
          stopSimulation(orderId);
          io.to(`order:${orderId}`).emit('simulation:complete', { orderId });
        }
        return;
      }

      const pending = events.find(e => e.status === 'PENDING');
      if (!pending) {
        stopSimulation(orderId);
        io.to(`order:${orderId}`).emit('simulation:complete', { orderId });
        return;
      }

      const updatedEvent = await prisma.orderEvent.update({
        where: { id: pending.id }, data: { status: 'IN_PROGRESS', timestamp: now },
      });
      io.to(`order:${orderId}`).emit('order:event', updatedEvent);
    } catch (error) {
      console.error(`Simulation error for ${orderId}:`, error);
      stopSimulation(orderId);
    }
  };

  run();
  const timer = setInterval(run, intervalMs);
  activeSimulations.set(orderId, timer);
  console.log(`▶️  Simulation started for ${orderId} (${intervalMs}ms)`);
  return true;
}

export function stopSimulation(orderId: string): void {
  const timer = activeSimulations.get(orderId);
  if (timer) { clearInterval(timer); activeSimulations.delete(orderId); }
}

export async function resetOrder(orderId: string, prisma: PrismaClient, io: Server): Promise<void> {
  const now = new Date();
  await prisma.order.update({
    where: { orderId },
    data: { currentStage: 'payment_verified', confidenceScore: 72, emotionalState: 'NORMAL', updatedAt: now },
  });

  const events = await prisma.orderEvent.findMany({ where: { orderId }, orderBy: { sortOrder: 'asc' } });
  for (let i = 0; i < events.length; i++) {
    await prisma.orderEvent.update({
      where: { id: events[i].id },
      data: {
        status: i === 0 ? 'COMPLETED' : i === 1 ? 'IN_PROGRESS' : 'PENDING',
        timestamp: now, verifiedBy: i === 0 ? stageVerifiers[events[i].stage] : null,
        proofData: null, notes: stageNotes[events[i].stage],
      },
    });
  }

  await prisma.ledgerEntry.deleteMany({ where: { orderId } });
  await prisma.ledgerEntry.create({
    data: {
      orderId, eventType: 'Payment Confirmed', description: 'Your payment has been securely verified.',
      timestamp: now, verifiedBy: 'Razorpay',
      verificationHash: hash(`${orderId}-payment-${now.toISOString()}`),
    },
  });

  io.to(`order:${orderId}`).emit('order:reset', { orderId });
  io.to(`order:${orderId}`).emit('order:confidence', { orderId, confidenceScore: 72, confidenceLabel: 'Moderate' });
}
