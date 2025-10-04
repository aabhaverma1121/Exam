import { io, Socket } from 'socket.io-client';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(userId: string, userRole: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io('ws://localhost:3001', {
          auth: {
            userId,
            userRole
          },
          transports: ['websocket']
        });

        this.socket.on('connect', () => {
          console.log('Connected to WebSocket server');
          this.reconnectAttempts = 0;
          resolve();
        });

        this.socket.on('disconnect', () => {
          console.log('Disconnected from WebSocket server');
          this.handleReconnect();
        });

        this.socket.on('connect_error', (error) => {
          console.error('WebSocket connection error:', error);
          reject(error);
        });

        // Set up event listeners
        this.setupEventListeners();
      } catch (error) {
        reject(error);
      }
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.socket?.connect();
      }, 2000 * this.reconnectAttempts);
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Real-time exam updates
    this.socket.on('exam_started', (data) => {
      window.dispatchEvent(new CustomEvent('exam_started', { detail: data }));
    });

    this.socket.on('exam_ended', (data) => {
      window.dispatchEvent(new CustomEvent('exam_ended', { detail: data }));
    });

    // Real-time incident updates
    this.socket.on('incident_reported', (data) => {
      window.dispatchEvent(new CustomEvent('incident_reported', { detail: data }));
    });

    this.socket.on('warning_issued', (data) => {
      window.dispatchEvent(new CustomEvent('warning_issued', { detail: data }));
    });

    // Real-time chat messages
    this.socket.on('new_message', (data) => {
      window.dispatchEvent(new CustomEvent('new_message', { detail: data }));
    });

    // Real-time session updates
    this.socket.on('session_update', (data) => {
      window.dispatchEvent(new CustomEvent('session_update', { detail: data }));
    });

    // AI detection alerts
    this.socket.on('ai_detection', (data) => {
      window.dispatchEvent(new CustomEvent('ai_detection', { detail: data }));
    });
  }

  // Send messages
  sendMessage(receiverId: string, message: string, type: 'text' | 'alert' | 'emergency') {
    if (this.socket) {
      this.socket.emit('send_message', {
        receiverId,
        message,
        type,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Report incidents
  reportIncident(incidentData: any) {
    if (this.socket) {
      this.socket.emit('report_incident', incidentData);
    }
  }

  // Issue warnings
  issueWarning(sessionId: string, warningData: any) {
    if (this.socket) {
      this.socket.emit('issue_warning', { sessionId, ...warningData });
    }
  }

  // Join exam session room
  joinExamSession(sessionId: string) {
    if (this.socket) {
      this.socket.emit('join_session', sessionId);
    }
  }

  // Leave exam session room
  leaveExamSession(sessionId: string) {
    if (this.socket) {
      this.socket.emit('leave_session', sessionId);
    }
  }

  // Update session status
  updateSessionStatus(sessionId: string, status: string) {
    if (this.socket) {
      this.socket.emit('update_session_status', { sessionId, status });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const websocketService = new WebSocketService();