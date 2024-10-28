import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

class WebSocketService {
  private socket!: Socket;

  connect(namespace: string): void {
    this.socket = io(`http://localhost:3001${namespace}`, {
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected with ID:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('connect_error', (err) => {
      console.error('WebSocket connection error: ', err);
    });
  }

  emit(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  on<T>(event: string): Observable<T> {
    return new Observable<T>((observer) => {
      this.socket.on(event, (data: T) => {
        observer.next(data);
      });

      return () => {
        this.socket.off(event);
      };
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export const webSocketService = new WebSocketService();