import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { CheckCircle, Circle, Loader2, ChevronDown, ChevronUp, ShieldCheck, Star, PackageCheck } from 'lucide-react';
import { STAGE_CONFIG } from '../../lib/types';
import type { OrderEvent, SellerProfile } from '../../lib/types';
import { formatTime } from '../../lib/utils';

interface Props {
  event: OrderEvent;
  index: number;
  isLast: boolean;
  seller?: SellerProfile | null;
}

export function TimelineStage({ event, index, isLast, seller }: Props) {
  const [showProof, setShowProof] = useState(false);
  const config = STAGE_CONFIG[event.stage];
  const hasProof = event.stage === 'seller_acknowledged' && event.status === 'COMPLETED' && event.proofData;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="flex gap-4 sm:gap-6 relative"
    >
      {/* Timestamp */}
      <div className="w-16 sm:w-20 flex-shrink-0 text-right pt-0.5">
        {event.status !== 'PENDING' && (
          <span className="text-xs font-medium text-muted dark:text-muted-dark">
            {formatTime(event.timestamp)}
          </span>
        )}
      </div>

      {/* Status indicator + connector line */}
      <div className="flex flex-col items-center flex-shrink-0">
        <StatusDot status={event.status} />
        {!isLast && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: '100%' }}
            transition={{ delay: index * 0.08 + 0.2, duration: 0.5 }}
            className={`w-0.5 flex-1 min-h-[40px] mt-1 ${
              event.status === 'COMPLETED'
                ? 'bg-success'
                : event.status === 'IN_PROGRESS'
                ? 'bg-gradient-to-b from-primary to-gray-200 dark:to-gray-700'
                : 'border-l-2 border-dashed border-gray-200 dark:border-gray-700'
            }`}
          />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 pb-8 ${isLast ? 'pb-0' : ''}`}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className={`font-semibold text-sm sm:text-base ${
              event.status === 'PENDING' ? 'text-muted dark:text-muted-dark' : 'text-text dark:text-text-dark'
            }`}>
              {config?.label || event.stage}
            </h3>
            <p className={`text-xs sm:text-sm mt-0.5 ${
              event.status === 'PENDING' ? 'text-gray-400 dark:text-gray-600' : 'text-muted dark:text-muted-dark'
            }`}>
              {event.notes || config?.description}
            </p>
          </div>

          <StatusBadge status={event.status} />
        </div>

        {/* Proof of Trust toggle */}
        {hasProof && (
          <div className="mt-3">
            <button
              onClick={() => setShowProof(!showProof)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-dark transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {showProof ? 'Hide' : 'Show'} Proof of Trust
              {showProof ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <AnimatePresence>
              {showProof && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 p-4 rounded-xl border-2 border-dashed border-primary/30 dark:border-primary/20 bg-primary/5 dark:bg-primary/10">
                    <div className="flex items-center gap-2 mb-3">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-sm text-text dark:text-text-dark">
                        Seller Commitment Recorded ✓
                      </span>
                    </div>
                    <p className="text-xs text-muted dark:text-muted-dark mb-3">
                      The seller has acknowledged your order, reserved the item, and confirmed dispatch preparation.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-success" />
                        <span className="text-muted dark:text-muted-dark">Acknowledged at:</span>
                        <span className="font-medium text-text dark:text-text-dark">
                          {event.proofData?.acknowledgedAt ? formatTime(event.proofData.acknowledgedAt) : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-warning" />
                        <span className="text-muted dark:text-muted-dark">Seller Reliability:</span>
                        <span className="font-medium text-text dark:text-text-dark">
                          {seller?.reliabilityScore || event.proofData?.sellerReliability || 'N/A'}/5
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <PackageCheck className="w-3.5 h-3.5 text-success" />
                        <span className="text-muted dark:text-muted-dark">Packaging initiated</span>
                        <span className="font-medium text-success">✅</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function StatusDot({ status }: { status: string }) {
  if (status === 'COMPLETED') {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="w-7 h-7 rounded-full bg-success flex items-center justify-center shadow-sm shadow-success/30"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <motion.path
            d="M5 12l5 5L19 7"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          />
        </svg>
      </motion.div>
    );
  }

  if (status === 'IN_PROGRESS') {
    return (
      <div className="relative w-7 h-7">
        <motion.div
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-primary/20"
        />
        <div className="absolute inset-1 rounded-full bg-primary flex items-center justify-center">
          <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-7 h-7 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
      <Circle className="w-3 h-3 text-gray-300 dark:text-gray-600" />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    COMPLETED: { label: 'Completed', className: 'bg-success/10 text-success dark:bg-success/20' },
    IN_PROGRESS: { label: 'In Progress', className: 'bg-primary/10 text-primary dark:bg-primary/20' },
    PENDING: { label: 'Pending', className: 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500' },
  }[status] || { label: status, className: 'bg-gray-100 text-gray-400' };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
}
