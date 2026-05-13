import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, CheckCircle, Eye, Zap, Lock, Activity } from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-success/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-sm font-medium mb-8"
            >
              <Shield className="w-4 h-4" />
              Post-Purchase Trust System
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text dark:text-text-dark leading-tight"
            >
              Your customers deserve to{' '}
              <span className="bg-gradient-to-r from-primary via-primary-light to-success bg-clip-text text-transparent">
                know the truth
              </span>{' '}
              after they pay.
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-muted dark:text-muted-dark max-w-2xl mx-auto leading-relaxed"
            >
              Ordra transforms the anxious silence after checkout into a live, trust-building experience.
              Every backend action — verified, timestamped, and proven.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/demo">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(108, 99, 255, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white font-bold text-base shadow-xl shadow-primary/25 flex items-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Watch Live Demo
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link to="/order/ORD-2024-7891">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-2xl bg-white dark:bg-card-dark border border-border dark:border-border-dark text-text dark:text-text-dark font-bold text-base shadow-sm flex items-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  View Sample Order
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* Feature Mockup Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <div className="bg-white dark:bg-card-dark rounded-3xl shadow-2xl border border-border dark:border-border-dark p-6 sm:p-8">
              {/* Mini preview of order trust page */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-success to-success-light flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-text dark:text-text-dark">Your Order Is Secure</h3>
                  <p className="text-sm text-muted dark:text-muted-dark">Payment verified • Item reserved</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-3xl font-extrabold text-success font-mono">92%</p>
                  <p className="text-xs text-success font-semibold">Very High</p>
                </div>
              </div>

              {/* Mini timeline */}
              <div className="space-y-3">
                {[
                  { label: 'Payment Verified', done: true },
                  { label: 'Inventory Reserved', done: true },
                  { label: 'Seller Acknowledged', done: true },
                  { label: 'Package Secured', active: true },
                  { label: 'In Transit', pending: true },
                ].map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    {step.done ? (
                      <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" fill="currentColor" />
                      </div>
                    ) : step.active ? (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600" />
                    )}
                    <span className={`text-sm ${step.pending ? 'text-gray-400' : 'text-text dark:text-text-dark'} font-medium`}>
                      {step.label}
                    </span>
                    {step.done && <span className="text-[10px] text-success font-bold ml-auto">✓ Verified</span>}
                    {step.active && <span className="text-[10px] text-primary font-bold ml-auto pulse-dot">● Live</span>}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-white dark:bg-card-dark border-y border-border dark:border-border-dark py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text dark:text-text-dark">
              The Post-Purchase{' '}
              <span className="text-danger">Trust Gap</span>
            </h2>
            <p className="mt-4 text-muted dark:text-muted-dark">
              After payment, customers enter an anxiety zone. Vague statuses like "Preparing for dispatch"
              aren't enough. They need proof.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: Eye,
                title: 'Real-Time Visibility',
                description: 'Every backend action — payment, inventory, seller acknowledgment — visible and verified.',
              },
              {
                icon: Lock,
                title: 'Cryptographic Proof',
                description: 'Each milestone is hashed and timestamped. Download your Order Assurance Ledger as a PDF.',
              },
              {
                icon: Activity,
                title: 'Emotional Intelligence',
                description: 'Smart banners that detect delays and proactively reassure — or alert when action is needed.',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface dark:bg-surface-dark rounded-2xl p-6 border border-border dark:border-border-dark"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-text dark:text-text-dark mb-2">{feature.title}</h3>
                <p className="text-sm text-muted dark:text-muted-dark">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Orders Preview */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-extrabold text-text dark:text-text-dark">
              Explore Demo Orders
            </h2>
            <p className="mt-3 text-muted dark:text-muted-dark">
              Click any order to see the full trust experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { id: 'ORD-2024-7891', product: 'Samsung Galaxy S24 Ultra', price: '₹1,29,999', stage: '4/8 stages', score: 92 },
              { id: 'ORD-2024-7892', product: 'Nike Air Max 270 React', price: '₹12,499', stage: '2/8 stages', score: 88 },
              { id: 'ORD-2024-7893', product: 'Bosch Washing Machine', price: '₹34,999', stage: '1/8 stages', score: 95 },
              { id: 'ORD-2024-7894', product: "Levi's Denim Jacket", price: '₹4,299', stage: '5/8 ⚠️', score: 74 },
              { id: 'ORD-2024-7895', product: 'MacBook Air M3', price: '₹1,14,900', stage: 'Delivered ✅', score: 100 },
            ].map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link to={`/order/${order.id}`}>
                  <motion.div
                    whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.1)' }}
                    className="bg-white dark:bg-card-dark rounded-2xl p-5 border border-border dark:border-border-dark shadow-sm cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono text-muted dark:text-muted-dark bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                        {order.id}
                      </span>
                      <span className={`text-lg font-bold font-mono ${order.score >= 90 ? 'text-success' : order.score >= 75 ? 'text-success-light' : 'text-warning'}`}>
                        {order.score}%
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm text-text dark:text-text-dark mb-1">{order.product}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-primary">{order.price}</span>
                      <span className="text-[11px] text-muted dark:text-muted-dark">{order.stage}</span>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
