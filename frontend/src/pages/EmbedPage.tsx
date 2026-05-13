import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, Shield } from 'lucide-react';
import { api } from '../lib/api';
import { getSocket, joinOrder, leaveOrder } from '../lib/socket';
import { HeroTrustBanner } from '../components/order/HeroTrustBanner';
import { EmotionalBanner } from '../components/order/EmotionalBanner';
import { LiveJourney } from '../components/order/LiveJourney';
import { AssuranceLedger } from '../components/order/AssuranceLedger';
import type { Order, OrderEvent } from '../lib/types';

export function EmbedPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    try {
      const data = await api.getOrder(orderId);
      setOrder(data);
    } catch {
      // Silently fail in embed mode
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  useEffect(() => {
    if (!orderId) return;
    const socket = getSocket();
    joinOrder(orderId);

    socket.on('order:event', (event: OrderEvent) => {
      setOrder((prev) => {
        if (!prev) return prev;
        const events = prev.events.map((e) => e.stage === event.stage ? { ...e, ...event } : e);
        return { ...prev, events, updatedAt: new Date().toISOString() };
      });
    });

    socket.on('order:confidence', (data: { confidenceScore: number }) => {
      setOrder((prev) => prev ? { ...prev, confidenceScore: data.confidenceScore, updatedAt: new Date().toISOString() } : prev);
    });

    socket.on('order:reset', () => fetchOrder());

    return () => {
      leaveOrder(orderId);
      socket.off('order:event');
      socket.off('order:confidence');
      socket.off('order:reset');
    };
  }, [orderId, fetchOrder]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen text-sm text-muted">
        Order not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark">
      {/* Minimal header */}
      <div className="border-b border-border dark:border-border-dark bg-white dark:bg-card-dark px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-primary">Ordra</span>
          <span className="text-[10px] text-muted dark:text-muted-dark ml-auto font-mono">
            {order.orderId}
          </span>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        <EmotionalBanner state={order.emotionalState} />
        <HeroTrustBanner order={order} />
        <LiveJourney events={order.events} seller={order.seller} />
        <AssuranceLedger entries={order.ledgerEntries} orderId={order.orderId} />
      </div>

      <div className="border-t border-border dark:border-border-dark px-4 py-3 text-center">
        <p className="text-[10px] text-muted dark:text-muted-dark">
          Powered by Ordra — Post-Purchase Trust System
        </p>
      </div>
    </div>
  );
}
