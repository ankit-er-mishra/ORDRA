import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

interface Props {
  state: 'NORMAL' | 'ATTENTION' | 'ACTION_REQUIRED';
}

const bannerConfig = {
  NORMAL: {
    icon: CheckCircle,
    message: 'Everything is running smoothly. Your order is on track.',
    bg: 'bg-success/10 dark:bg-success/20 border-success/20 dark:border-success/30',
    text: 'text-success',
    iconColor: 'text-success',
  },
  ATTENTION: {
    icon: AlertTriangle,
    message: 'Minor delay detected — courier allocation taking slightly longer than usual. No action needed.',
    bg: 'bg-warning/10 dark:bg-warning/20 border-warning/20 dark:border-warning/30',
    text: 'text-warning',
    iconColor: 'text-warning',
  },
  ACTION_REQUIRED: {
    icon: AlertCircle,
    message: 'We need your confirmation to proceed.',
    bg: 'bg-danger/10 dark:bg-danger/20 border-danger/20 dark:border-danger/30',
    text: 'text-danger',
    iconColor: 'text-danger',
  },
};

export function EmotionalBanner({ state }: Props) {
  const config = bannerConfig[state];
  const Icon = config.icon;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`rounded-xl border px-4 py-3 flex items-center gap-3 ${config.bg}`}
      >
        <Icon className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} />
        <p className={`text-sm font-medium ${config.text}`}>
          {config.message}
        </p>
        {state === 'ACTION_REQUIRED' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="ml-auto px-4 py-1.5 rounded-lg bg-danger text-white text-xs font-bold shadow-sm"
          >
            Confirm Now
          </motion.button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
