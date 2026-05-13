import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { startSimulation, stopSimulation, resetOrder } from '../services/simulation';

export const simulateRoutes = Router();

function getPrisma(req: Request): PrismaClient {
  return req.app.get('prisma');
}

// POST /api/simulate/:orderId — Start auto-progression
simulateRoutes.post('/:orderId', async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma(req);
    const io = req.app.get('io');
    const { speed } = req.body; // 'fast' (8s) or 'normal' (30s)

    const order = await prisma.order.findUnique({
      where: { orderId: req.params.orderId },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const interval = speed === 'fast' ? 8000 : 30000;
    const started = startSimulation(req.params.orderId, prisma, io, interval);

    if (!started) {
      return res.json({ message: 'Simulation already running', orderId: req.params.orderId });
    }

    res.json({ message: 'Simulation started', orderId: req.params.orderId, intervalMs: interval });
  } catch (error) {
    console.error('Error starting simulation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/simulate/:orderId/stop — Stop simulation
simulateRoutes.post('/:orderId/stop', async (req: Request, res: Response) => {
  stopSimulation(req.params.orderId);
  res.json({ message: 'Simulation stopped', orderId: req.params.orderId });
});

// POST /api/simulate/:orderId/reset — Reset order to initial state
simulateRoutes.post('/:orderId/reset', async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma(req);
    const io = req.app.get('io');

    stopSimulation(req.params.orderId);
    await resetOrder(req.params.orderId, prisma, io);

    res.json({ message: 'Order reset', orderId: req.params.orderId });
  } catch (error) {
    console.error('Error resetting order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
