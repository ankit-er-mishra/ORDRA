import { motion } from 'framer-motion';
import { Warehouse, Clock, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Order } from '../../lib/types';
import { formatDate } from '../../lib/utils';

interface Props {
  order: Order;
}

export function OrderHeartbeat({ order }: Props) {
  const [countdown, setCountdown] = useState(24 * 60); // 24 minutes in seconds

  // Live countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;

  const handlerInfo = getHandlerInfo(order.currentStage);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <h2 className="text-xl font-bold text-text dark:text-text-dark mb-6">
        Order Heartbeat™
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1 — Currently Handled By */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-border dark:border-border-dark"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-4">
            <Warehouse className="w-5 h-5 text-primary" />
          </div>
          <p className="text-xs text-muted dark:text-muted-dark uppercase tracking-wider font-semibold mb-1">
            Currently Handled By
          </p>
          <h3 className="text-base font-bold text-text dark:text-text-dark">
            {handlerInfo.name}
          </h3>
          <p className="text-xs text-muted dark:text-muted-dark mt-0.5">
            {handlerInfo.location}
          </p>
          <p className="text-xs text-muted dark:text-muted-dark mt-2">
            {handlerInfo.description}
          </p>
        </motion.div>

        {/* Card 2 — Next Update Prediction */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-border dark:border-border-dark"
        >
          <div className="w-10 h-10 rounded-xl bg-warning/10 dark:bg-warning/20 flex items-center justify-center mb-4">
            <Clock className="w-5 h-5 text-warning" />
          </div>
          <p className="text-xs text-muted dark:text-muted-dark uppercase tracking-wider font-semibold mb-1">
            Next Update Prediction
          </p>
          <p className="text-sm text-muted dark:text-muted-dark">
            Courier pickup expected in
          </p>
          <motion.p
            key={countdown}
            className="text-2xl font-extrabold text-warning mt-1 font-mono"
          >
            ~{mins}:{secs.toString().padStart(2, '0')}
          </motion.p>
        </motion.div>

        {/* Card 3 — Delivery Confidence */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-border dark:border-border-dark"
        >
          <div className="w-10 h-10 rounded-xl bg-success/10 dark:bg-success/20 flex items-center justify-center mb-4">
            <TrendingUp className="w-5 h-5 text-success" />
          </div>
          <p className="text-xs text-muted dark:text-muted-dark uppercase tracking-wider font-semibold mb-1">
            Delivery Confidence
          </p>
          <h3 className="text-base font-bold text-text dark:text-text-dark">
            {formatDate(order.estimatedDelivery)}
          </h3>
          <p className="text-sm text-muted dark:text-muted-dark mt-1">
            Confidence: {order.confidenceScore}%
          </p>
          <div className="mt-3 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${order.confidenceScore}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full rounded-full bg-success"
            />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

function getHandlerInfo(stage: string) {
  const handlers: Record<string, { name: string; location: string; description: string }> = {
    payment_verified: { name: 'Payment Gateway', location: 'Automated System', description: 'Processing and verifying payment.' },
    inventory_reserved: { name: 'Warehouse Team', location: 'Delhi NCR', description: 'Responsible for picking, packing and quality check.' },
    seller_acknowledged: { name: 'Seller Operations', location: 'Seller Facility', description: 'Preparing and confirming dispatch readiness.' },
    package_secured: { name: 'Warehouse Team', location: 'Delhi NCR', description: 'Responsible for picking, packing and quality check.' },
    courier_pickup: { name: 'Courier Partner', location: 'Local Hub', description: 'Assigned courier heading to pickup location.' },
    in_transit: { name: 'Logistics Network', location: 'Regional Hub', description: 'Package moving through sorting and transit network.' },
    out_for_delivery: { name: 'Delivery Executive', location: 'Your Area', description: 'Final mile delivery in progress.' },
    delivered: { name: 'Delivery Confirmed', location: 'Your Location', description: 'Package successfully delivered.' },
  };
  return handlers[stage] || handlers.payment_verified;
}
