import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

export function setupSocket(io: Server, prisma: PrismaClient) {
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    socket.on('join:order', (orderId: string) => {
      socket.join(`order:${orderId}`);
      console.log(`👁️  Client ${socket.id} watching order: ${orderId}`);
    });

    socket.on('leave:order', (orderId: string) => {
      socket.leave(`order:${orderId}`);
      console.log(`👋 Client ${socket.id} left order: ${orderId}`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
}

export function emitOrderEvent(io: Server, orderId: string, event: any) {
  io.to(`order:${orderId}`).emit('order:event', event);
}

export function emitConfidenceUpdate(io: Server, orderId: string, data: any) {
  io.to(`order:${orderId}`).emit('order:confidence', data);
}

export function emitEmotionalState(io: Server, orderId: string, data: any) {
  io.to(`order:${orderId}`).emit('order:emotional-state', data);
}
