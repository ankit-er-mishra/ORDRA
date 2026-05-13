import express from 'express';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import { orderRoutes } from './routes/orders';
import { simulateRoutes } from './routes/simulate';
import { setupSocket } from './socket';

dotenv.config();

const app = express();
const server = http.createServer(app);
const prisma = new PrismaClient();

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Make prisma and io available to routes
app.set('prisma', prisma);
app.set('io', io);

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/simulate', simulateRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'ordra-backend', timestamp: new Date().toISOString() });
});

// Setup Socket.io
setupSocket(io, prisma);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`\n🛡️  Ordra Backend running on http://localhost:${PORT}`);
  console.log(`📡 Socket.io ready for connections`);
  console.log(`📊 API: http://localhost:${PORT}/api/health\n`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down...');
  await prisma.$disconnect();
  server.close();
  process.exit(0);
});
