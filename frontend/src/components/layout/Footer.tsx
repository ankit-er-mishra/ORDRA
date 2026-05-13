import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border dark:border-border-dark bg-white dark:bg-card-dark mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Ordra
            </span>
          </div>
          <p className="text-xs text-muted dark:text-muted-dark">
            © {new Date().getFullYear()} Ordra — Post-Purchase Trust System. Building trust, one order at a time.
          </p>
        </div>
      </div>
    </footer>
  );
}
