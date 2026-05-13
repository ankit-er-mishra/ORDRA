import { motion } from 'framer-motion';
import { Shield, CheckCircle, Info } from 'lucide-react';
import { ConfidenceCard } from './ConfidenceCard';
import type { Order } from '../../lib/types';

interface Props {
  order: Order;
}

export function HeroTrustBanner({ order }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-1 lg:grid-cols-5 gap-6"
    >
      {/* Left: Trust Message */}
      <div className="lg:col-span-3 bg-white dark:bg-card-dark rounded-2xl p-6 sm:p-8 shadow-sm border border-border dark:border-border-dark relative overflow-hidden">
        {/* Decorative gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />

        <div className="flex items-start gap-5 relative">
          {/* Animated Shield */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="relative flex-shrink-0"
          >
            {/* Rotating ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 w-20 h-20 -m-2"
            >
              <svg viewBox="0 0 80 80" className="w-full h-full">
                <circle
                  cx="40" cy="40" r="36"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="2"
                  strokeDasharray="8 6"
                  opacity="0.3"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6C63FF" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-success to-success-light flex items-center justify-center shadow-lg shadow-success/25">
              <Shield className="w-8 h-8 text-white" strokeWidth={2} />
            </div>

            {/* Checkmark pop */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 10, delay: 0.6 }}
              className="absolute -top-1 -right-1 w-7 h-7 bg-success rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-card-dark"
            >
              <CheckCircle className="w-4 h-4 text-white" fill="currentColor" />
            </motion.div>
          </motion.div>

          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl font-bold text-text dark:text-text-dark"
            >
              Your Order Is{' '}
              <span className="bg-gradient-to-r from-success to-success-light bg-clip-text text-transparent">
                Secure
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-2 text-muted dark:text-muted-dark text-sm sm:text-base"
            >
              Your payment has been verified and your item is reserved for you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 dark:bg-success/20 text-success text-sm font-medium"
            >
              <Info className="w-4 h-4" />
              <span>No action required from you. We'll proactively update you.</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right: Confidence Card */}
      <div className="lg:col-span-2">
        <ConfidenceCard score={order.confidenceScore} updatedAt={order.updatedAt} />
      </div>
    </motion.section>
  );
}
