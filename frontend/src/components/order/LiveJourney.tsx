import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { TimelineStage } from './TimelineStage';
import type { OrderEvent, SellerProfile } from '../../lib/types';

interface Props {
  events: OrderEvent[];
  seller?: SellerProfile | null;
}

export function LiveJourney({ events, seller }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white dark:bg-card-dark rounded-2xl p-6 sm:p-8 shadow-sm border border-border dark:border-border-dark"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-text dark:text-text-dark">
          Live Order Journey
        </h2>
        <button className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark font-medium transition-colors">
          View all updates <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="relative">
        {events.map((event, index) => (
          <TimelineStage
            key={event.id}
            event={event}
            index={index}
            isLast={index === events.length - 1}
            seller={event.stage === 'seller_acknowledged' ? seller : undefined}
          />
        ))}
      </div>
    </motion.section>
  );
}
