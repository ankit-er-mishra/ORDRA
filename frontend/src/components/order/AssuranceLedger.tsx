import { motion } from 'framer-motion';
import { CheckCircle, Download, Shield, QrCode } from 'lucide-react';
import type { LedgerEntry } from '../../lib/types';
import { formatTime, formatDate } from '../../lib/utils';
import { api } from '../../lib/api';
import { useState } from 'react';

interface Props {
  entries: LedgerEntry[];
  orderId: string;
  orderUrl?: string;
}

export function AssuranceLedger({ entries, orderId }: Props) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await api.downloadPDF(orderId);
    } catch (err) {
      console.error('PDF download failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
          Trust Passport
        </span>
      </div>

      <h2 className="text-xl font-bold text-text dark:text-text-dark mb-1">
        Order Assurance Ledger™
      </h2>
      <p className="text-sm text-muted dark:text-muted-dark mb-8">
        A digital proof of trust and verification — every milestone of your order, signed and timestamped.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Ledger Entries */}
        <div className="lg:col-span-3 space-y-3">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="bg-white dark:bg-card-dark rounded-xl p-4 sm:p-5 shadow-sm border border-border dark:border-border-dark flex items-start gap-4"
            >
              <div className="w-9 h-9 rounded-xl bg-success/10 dark:bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-text dark:text-text-dark">
                  {entry.eventType}
                </h4>
                <p className="text-xs text-muted dark:text-muted-dark mt-0.5">
                  {entry.description}
                </p>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="text-[11px] text-muted dark:text-muted-dark">
                    {formatTime(entry.timestamp)} · {formatDate(entry.timestamp)}
                  </span>
                  <span className="text-[11px] text-muted dark:text-muted-dark">
                    Verified by {entry.verifiedBy}
                  </span>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full bg-success/10 dark:bg-success/20 text-success text-[10px] font-bold uppercase flex-shrink-0">
                🟢 Verified
              </span>
            </motion.div>
          ))}
        </div>

        {/* Right: Trust Certificate + QR */}
        <div className="lg:col-span-2 space-y-4">
          {/* Trust Certificate */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-border dark:border-border-dark"
          >
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-[10px] font-bold uppercase">
              Trust Certificate
            </span>

            <h3 className="text-lg font-bold text-text dark:text-text-dark mt-3">
              Your Order Assurance Ledger
            </h3>
            <p className="text-sm text-muted dark:text-muted-dark mt-1">
              A signed digital proof of every verification event on this order — yours to keep.
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownload}
              disabled={downloading}
              className="mt-5 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow disabled:opacity-50"
            >
              {downloading ? (
                <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {downloading ? 'Generating...' : 'Download Ledger PDF'}
            </motion.button>

            <div className="flex items-center gap-2 mt-3 justify-center">
              {['PDF', 'Secure', 'Verifiable'].map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-[10px] text-muted dark:text-muted-dark font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Digital Verification Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-2xl p-6 border border-primary/20 dark:border-primary/30"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm text-text dark:text-text-dark">
                  Digitally Verified by Ordra
                </p>
              </div>
            </div>
            <p className="text-xs text-muted dark:text-muted-dark">
              This order has been digitally verified, secured and acknowledged by all required systems.
            </p>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-primary font-medium">
              <QrCode className="w-3.5 h-3.5" />
              <span>Includes QR verification</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
