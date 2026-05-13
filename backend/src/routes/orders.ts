import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { generateLedgerPDF } from '../services/pdf';

export const orderRoutes = Router();

function getPrisma(req: Request): PrismaClient {
  return req.app.get('prisma');
}

// GET /api/orders/:orderId — Full order with all events
orderRoutes.get('/:orderId', async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma(req);
    const order = await prisma.order.findUnique({
      where: { orderId: req.params.orderId },
      include: {
        events: { orderBy: { sortOrder: 'asc' } },
        ledgerEntries: { orderBy: { timestamp: 'asc' } },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Get seller profile
    const seller = order.sellerId
      ? await prisma.sellerProfile.findUnique({ where: { sellerId: order.sellerId } })
      : null;

    res.json({ ...order, seller });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/orders/:orderId/journey — Live journey timeline
orderRoutes.get('/:orderId/journey', async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma(req);
    const events = await prisma.orderEvent.findMany({
      where: { orderId: req.params.orderId },
      orderBy: { sortOrder: 'asc' },
    });

    if (events.length === 0) {
      return res.status(404).json({ error: 'No journey found for this order' });
    }

    res.json(events);
  } catch (error) {
    console.error('Error fetching journey:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/orders/:orderId/ledger — Full assurance ledger entries
orderRoutes.get('/:orderId/ledger', async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma(req);
    const entries = await prisma.ledgerEntry.findMany({
      where: { orderId: req.params.orderId },
      orderBy: { timestamp: 'asc' },
    });

    res.json(entries);
  } catch (error) {
    console.error('Error fetching ledger:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/orders/:orderId/pdf — Generate & stream Ledger PDF
orderRoutes.get('/:orderId/pdf', async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma(req);
    const order = await prisma.order.findUnique({
      where: { orderId: req.params.orderId },
      include: {
        ledgerEntries: { orderBy: { timestamp: 'asc' } },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const orderUrl = `${frontendUrl}/order/${order.orderId}`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Ordra-Ledger-${order.orderId}.pdf"`);

    await generateLedgerPDF(order, order.ledgerEntries, orderUrl, res);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/orders/:orderId/confidence — Confidence score + prediction
orderRoutes.get('/:orderId/confidence', async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma(req);
    const order = await prisma.order.findUnique({
      where: { orderId: req.params.orderId },
      select: {
        orderId: true,
        confidenceScore: true,
        estimatedDelivery: true,
        emotionalState: true,
        currentStage: true,
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const confidenceLabel =
      order.confidenceScore >= 90 ? 'Very High' :
      order.confidenceScore >= 75 ? 'High' :
      order.confidenceScore >= 50 ? 'Moderate' : 'Low';

    res.json({
      ...order,
      confidenceLabel,
      prediction: {
        estimatedDelivery: order.estimatedDelivery,
        onTrack: order.confidenceScore >= 75,
      },
    });
  } catch (error) {
    console.error('Error fetching confidence:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/orders — Create new order
orderRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma(req);
    const {
      productName, sellerName, sellerId, amount, paymentMethod,
      customerEmail, customerName, estimatedDelivery, platform,
    } = req.body;

    const orderId = `ORD-${Date.now().toString().slice(-8)}`;

    const order = await prisma.order.create({
      data: {
        orderId,
        platform: platform || 'Ordra',
        productName,
        sellerName,
        sellerId,
        amount,
        paymentMethod,
        customerEmail,
        customerName,
        estimatedDelivery: new Date(estimatedDelivery),
        confidenceScore: 85,
        emotionalState: 'NORMAL',
        currentStage: 'payment_verified',
      },
    });

    // Create initial event
    await prisma.orderEvent.create({
      data: {
        orderId: order.orderId,
        stage: 'payment_verified',
        status: 'COMPLETED',
        verifiedBy: 'Payment Gateway',
        notes: 'Your payment has been securely verified.',
        sortOrder: 0,
      },
    });

    // Create initial ledger entry
    await prisma.ledgerEntry.create({
      data: {
        orderId: order.orderId,
        eventType: 'Payment Confirmed',
        description: 'Your payment has been securely verified.',
        verifiedBy: 'Payment Gateway',
        verificationHash: crypto.createHash('sha256')
          .update(`${order.orderId}-payment-${new Date().toISOString()}`)
          .digest('hex').slice(0, 16),
      },
    });

    // Create remaining stages as pending
    const stages = [
      'inventory_reserved', 'seller_acknowledged', 'package_secured',
      'courier_pickup', 'in_transit', 'out_for_delivery', 'delivered',
    ];
    const stageNotes: Record<string, string> = {
      inventory_reserved: 'Item has been reserved in our warehouse.',
      seller_acknowledged: 'Seller has confirmed and committed your item for dispatch.',
      package_secured: 'Your item is carefully packed and verified by seller.',
      courier_pickup: 'Waiting for courier partner to pick up the package.',
      in_transit: 'Your package is on its way to you.',
      out_for_delivery: 'Your package is out for delivery.',
      delivered: 'Your package will be delivered soon.',
    };

    for (let i = 0; i < stages.length; i++) {
      await prisma.orderEvent.create({
        data: {
          orderId: order.orderId,
          stage: stages[i],
          status: 'PENDING',
          notes: stageNotes[stages[i]],
          sortOrder: i + 1,
        },
      });
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/orders/:orderId/events — Add new event
orderRoutes.post('/:orderId/events', async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma(req);
    const io = req.app.get('io');
    const { stage, status, verifiedBy, proofData, notes } = req.body;

    // Update existing event
    const existingEvent = await prisma.orderEvent.findFirst({
      where: { orderId: req.params.orderId, stage },
    });

    if (!existingEvent) {
      return res.status(404).json({ error: 'Event stage not found' });
    }

    const event = await prisma.orderEvent.update({
      where: { id: existingEvent.id },
      data: {
        status: status || 'COMPLETED',
        timestamp: new Date(),
        verifiedBy,
        proofData,
        notes,
      },
    });

    // Update order's current stage
    await prisma.order.update({
      where: { orderId: req.params.orderId },
      data: { currentStage: stage, updatedAt: new Date() },
    });

    // Emit via Socket.io
    io.to(`order:${req.params.orderId}`).emit('order:event', event);

    res.json(event);
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
