import type { Order, OrderEvent, LedgerEntry, ConfidenceData } from './types';

const API_BASE = '/api';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export const api = {
  getOrder: (orderId: string) =>
    fetchJSON<Order>(`/orders/${orderId}`),

  getJourney: (orderId: string) =>
    fetchJSON<OrderEvent[]>(`/orders/${orderId}/journey`),

  getLedger: (orderId: string) =>
    fetchJSON<LedgerEntry[]>(`/orders/${orderId}/ledger`),

  getConfidence: (orderId: string) =>
    fetchJSON<ConfidenceData>(`/orders/${orderId}/confidence`),

  downloadPDF: async (orderId: string) => {
    const res = await fetch(`${API_BASE}/orders/${orderId}/pdf`);
    if (!res.ok) throw new Error('Failed to download PDF');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ordra-Ledger-${orderId}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  },

  createOrder: (data: any) =>
    fetchJSON<Order>('/orders', { method: 'POST', body: JSON.stringify(data) }),

  addEvent: (orderId: string, data: any) =>
    fetchJSON<OrderEvent>(`/orders/${orderId}/events`, { method: 'POST', body: JSON.stringify(data) }),

  startSimulation: (orderId: string, speed: 'fast' | 'normal' = 'fast') =>
    fetchJSON<{ message: string }>(`/simulate/${orderId}`, {
      method: 'POST',
      body: JSON.stringify({ speed }),
    }),

  stopSimulation: (orderId: string) =>
    fetchJSON<{ message: string }>(`/simulate/${orderId}/stop`, { method: 'POST' }),

  resetSimulation: (orderId: string) =>
    fetchJSON<{ message: string }>(`/simulate/${orderId}/reset`, { method: 'POST' }),
};
