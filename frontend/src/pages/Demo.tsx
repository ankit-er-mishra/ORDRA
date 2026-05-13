import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Square, Loader2, Zap } from 'lucide-react';
import { api } from '../lib/api';
import { getSocket, joinOrder, leaveOrder } from '../lib/socket';
import { HeroTrustBanner } from '../components/order/HeroTrustBanner';
import { EmotionalBanner } from '../components/order/EmotionalBanner';
import { LiveJourney } from '../components/order/LiveJourney';
import { AssuranceLedger } from '../components/order/AssuranceLedger';
import { OrderHeartbeat } from '../components/order/OrderHeartbeat';
import type { Order, OrderEvent } from '../lib/types';

const DEMO_ORDER_ID = 'ORD-2024-7893'; // Bosch Washing Machine — only 1 stage done, good for demo

export function Demo() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [completed, setCompleted] = useState(false);

  const fetchOrder = useCallback(async () => {
    try {
      const data = await api.getOrder(DEMO_ORDER_ID);
      setOrder(data);
    } catch (err) {
      console.error('Failed to load demo order:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // Socket.io
  useEffect(() => {
    const socket = getSocket();
    joinOrder(DEMO_ORDER_ID);

    socket.on('order:event', (event: OrderEvent) => {
      setOrder((prev) => {
        if (!prev) return prev;
        const events = prev.events.map((e) =>
          e.stage === event.stage ? { ...e, ...event } : e
        );
        return { ...prev, events, currentStage: event.stage, updatedAt: new Date().toISOString() };
      });
    });

    socket.on('order:confidence', (data: { confidenceScore: number }) => {
      setOrder((prev) => prev ? { ...prev, confidenceScore: data.confidenceScore, updatedAt: new Date().toISOString() } : prev);
    });

    socket.on('order:reset', () => {
      setCompleted(false);
      fetchOrder();
    });

    socket.on('simulation:complete', () => {
      setSimulating(false);
      setCompleted(true);
    });

    return () => {
      leaveOrder(DEMO_ORDER_ID);
      socket.off('order:event');
      socket.off('order:confidence');
      socket.off('order:reset');
      socket.off('simulation:complete');
    };
  }, [fetchOrder]);

  const handleStart = async () => {
    setSimulating(true);
    setCompleted(false);
    await api.startSimulation(DEMO_ORDER_ID, 'fast');
  };

  const handleStop = async () => {
    await api.stopSimulation(DEMO_ORDER_ID);
    setSimulating(false);
  };

  const handleReset = async () => {
    await api.resetSimulation(DEMO_ORDER_ID);
    setSimulating(false);
    setCompleted(false);
  };

  if (loading || !order) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Demo Controls */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-2xl p-5 sm:p-6 border border-primary/20 dark:border-primary/30"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-warning/20 text-warning text-[10px] font-bold uppercase">
                Demo Mode
              </span>
              {simulating && (
                <span className="px-2.5 py-0.5 rounded-full bg-success/20 text-success text-[10px] font-bold uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  Simulating
                </span>
              )}
              {completed && (
                <span className="px-2.5 py-0.5 rounded-full bg-success/20 text-success text-[10px] font-bold uppercase">
                  ✓ Complete
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-text dark:text-text-dark">
              Watch Ordra in Action
            </h2>
            <p className="text-sm text-muted dark:text-muted-dark mt-0.5">
              Click play to watch the order progress through all stages in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!simulating ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                disabled={completed}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm shadow-lg shadow-primary/25 disabled:opacity-50"
              >
                <Play className="w-4 h-4" fill="currentColor" />
                Watch Live Demo
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStop}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-danger text-white font-semibold text-sm"
              >
                <Square className="w-4 h-4" fill="currentColor" />
                Stop
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-card-dark border border-border dark:border-border-dark text-text dark:text-text-dark font-semibold text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Full order experience */}
      <div className="space-y-8">
        <EmotionalBanner state={order.emotionalState} />
        <HeroTrustBanner order={order} />
        <LiveJourney events={order.events} seller={order.seller} />
        <AssuranceLedger entries={order.ledgerEntries} orderId={order.orderId} />
        <OrderHeartbeat order={order} />
      </div>
    </div>
  );
}
