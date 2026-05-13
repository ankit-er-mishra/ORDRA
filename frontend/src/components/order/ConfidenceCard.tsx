import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getConfidenceLabel, timeAgo } from '../../lib/utils';

interface Props {
  score: number;
  updatedAt: string;
}

export function ConfidenceCard({ score, updatedAt }: Props) {
  const [displayScore, setDisplayScore] = useState(score);
  const label = getConfidenceLabel(score);

  // Count-up animation — animate from previous to new score
  useEffect(() => {
    const startVal = displayScore;
    const diff = score - startVal;
    if (diff === 0) return;

    const duration = 1200;
    const steps = 40;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      // Ease out curve
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(startVal + diff * eased));
      if (step >= steps) {
        setDisplayScore(score);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  const colorClass = score >= 90 ? 'text-success' : score >= 75 ? 'text-success-light' : score >= 50 ? 'text-warning' : 'text-danger';
  const barColor = score >= 90 ? 'bg-success' : score >= 75 ? 'bg-success-light' : score >= 50 ? 'bg-warning' : 'bg-danger';
  const labelColor = score >= 90 ? 'text-success' : score >= 75 ? 'text-success-light' : score >= 50 ? 'text-warning' : 'text-danger';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
      className="bg-white dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-border dark:border-border-dark h-full flex flex-col justify-center"
    >
      <p className="text-xs font-semibold text-muted dark:text-muted-dark uppercase tracking-wider mb-3">
        Confidence Level
      </p>

      <div className="text-center">
        <motion.div
          key={score}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <span className={`text-5xl font-extrabold ${colorClass} font-mono`}>
            {displayScore}
          </span>
          <span className={`text-2xl font-bold ${colorClass}`}>%</span>
        </motion.div>

        <p className={`text-sm font-semibold mt-1 ${labelColor}`}>
          {label}
        </p>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.2, type: 'spring', stiffness: 50 }}
          className={`h-full rounded-full ${barColor}`}
        />
      </div>

      {/* Live indicator */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted dark:text-muted-dark">
        <span>Last updated: {timeAgo(updatedAt)}</span>
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
        </span>
      </div>
    </motion.div>
  );
}
