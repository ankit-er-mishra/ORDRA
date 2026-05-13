export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function formatDateTime(timestamp: string): string {
  return `${formatDate(timestamp)}, ${formatTime(timestamp)}`;
}

export function getConfidenceLabel(score: number): string {
  if (score >= 90) return 'Very High';
  if (score >= 75) return 'High';
  if (score >= 50) return 'Moderate';
  return 'Low';
}

export function getConfidenceColor(score: number): string {
  if (score >= 90) return 'text-success';
  if (score >= 75) return 'text-success-light';
  if (score >= 50) return 'text-warning';
  return 'text-danger';
}

export function timeAgo(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
