import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { getSocket, joinOrder, leaveOrder } from '../lib/socket';
import { HeroTrustBanner } from '../components/order/HeroTrustBanner';
import { EmotionalBanner } from '../components/order/EmotionalBanner';
import { LiveJourney } from '../components/order/LiveJourney';
import { AssuranceLedger } from '../components/order/AssuranceLedger';
import { OrderHeartbeat } from '../components/order/OrderHeartbeat';
import type { Order, OrderEvent } from '../lib/types';

export function OrderPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    try {
      const data = await api.getOrder(orderId);
      setOrder(data);
      setError(null);
    } catch (err) {
      setError('Order not found');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // Socket.io real-time updates
  useEffect(() => {
    if (!orderId) return;

    const socket = getSocket();
    joinOrder(orderId);

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

    socket.on('order:emotional-state', (data: { emotionalState: string }) => {
      setOrder((prev) => prev ? { ...prev, emotionalState: data.emotionalState as any } : prev);
    });

    socket.on('order:reset', () => {
      fetchOrder();
    });

    return () => {
      leaveOrder(orderId);
      socket.off('order:event');
      socket.off('order:confidence');
      socket.off('order:emotional-state');
      socket.off('order:reset');
    };
  }, [orderId, fetchOrder]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted dark:text-muted-dark">Loading order details...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text dark:text-text-dark mb-2">Order Not Found</h2>
          <p className="text-muted dark:text-muted-dark">The order ID "{orderId}" doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Order ID Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-3 flex-wrap"
      >
        <span className="text-xs font-mono text-muted dark:text-muted-dark bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg">
          {order.orderId}
        </span>
        <span className="text-xs text-muted dark:text-muted-dark">
          {order.productName}
        </span>
      </motion.div>

      {/* Section 5: Emotional Banner */}
      <EmotionalBanner state={order.emotionalState} />

      {/* Section 1: Hero Trust Banner */}
      <HeroTrustBanner order={order} />

      {/* Section 2: Live Order Journey */}
      <LiveJourney events={order.events} seller={order.seller} />

      {/* Section 3: Assurance Ledger */}
      <AssuranceLedger
        entries={order.ledgerEntries}
        orderId={order.orderId}
      />

      {/* Section 4: Order Heartbeat */}
      <OrderHeartbeat order={order} />
    </div>
  );
}
