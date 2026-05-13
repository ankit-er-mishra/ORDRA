import { Link, useLocation } from 'react-router-dom';
import { Shield, Moon, Sun, Menu, X } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export function Navbar() {
  const { darkMode, toggleDarkMode } = useAppStore();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isEmbed = location.pathname.startsWith('/embed');

  if (isEmbed) return null;

  return (
    <nav className="sticky top-0 z-50 border-b border-border dark:border-border-dark bg-white/80 dark:bg-surface-dark/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ rotate: 5, scale: 1.05 }}
            className="relative"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/25">
              <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
          </motion.div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            Ordra
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/" current={location.pathname}>Home</NavLink>
          <NavLink to="/demo" current={location.pathname}>Demo</NavLink>
          <NavLink to="/order/ORD-2024-7891" current={location.pathname}>Sample Order</NavLink>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle dark mode"
          >
            <AnimatePresence mode="wait">
              {darkMode ? (
                <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Sun className="w-5 h-5 text-warning" />
                </motion.div>
              ) : (
                <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Moon className="w-5 h-5 text-muted" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <button
            className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border dark:border-border-dark overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              <MobileNavLink to="/" onClick={() => setMobileOpen(false)}>Home</MobileNavLink>
              <MobileNavLink to="/demo" onClick={() => setMobileOpen(false)}>Demo</MobileNavLink>
              <MobileNavLink to="/order/ORD-2024-7891" onClick={() => setMobileOpen(false)}>Sample Order</MobileNavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavLink({ to, current, children }: { to: string; current: string; children: React.ReactNode }) {
  const isActive = current === to;
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
        isActive
          ? 'bg-primary/10 text-primary dark:bg-primary/20'
          : 'text-muted hover:text-text dark:text-muted-dark dark:hover:text-text-dark hover:bg-gray-100 dark:hover:bg-white/5'
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, onClick, children }: { to: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-4 py-3 rounded-xl text-sm font-medium text-muted hover:text-text dark:text-muted-dark dark:hover:text-text-dark hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
    >
      {children}
    </Link>
  );
}
