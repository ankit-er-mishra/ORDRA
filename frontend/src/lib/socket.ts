import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io('/', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('🔌 Socket connected:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });
  }

  return socket;
}

export function joinOrder(orderId: string) {
  const s = getSocket();
  s.emit('join:order', orderId);
}

export function leaveOrder(orderId: string) {
  const s = getSocket();
  s.emit('leave:order', orderId);
}
