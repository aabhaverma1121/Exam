import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { websocketService } from '../services/websocket';
import { webrtcService } from '../services/webrtc';
import { useAuth } from './AuthContext';

interface RealtimeContextType {
  isConnected: boolean;
  liveExams: any[];
  liveSessions: any[];
  realtimeMessages: any[];
  incidents: any[];
  warnings: any[];
  sendMessage: (receiverId: string, message: string, type: 'text' | 'alert' | 'emergency') => void;
  reportIncident: (incidentData: any) => void;
  issueWarning: (sessionId: string, warningData: any) => void;
  startVideoCall: (peerId: string) => Promise<void>;
  startScreenShare: () => Promise<MediaStream>;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const RealtimeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [liveExams, setLiveExams] = useState<any[]>([]);
  const [liveSessions, setLiveSessions] = useState<any[]>([]);
  const [realtimeMessages, setRealtimeMessages] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [warnings, setWarnings] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      initializeRealtime();
    }

    return () => {
      cleanup();
    };
  }, [user]);

  const initializeRealtime = async () => {
    try {
      // Connect to WebSocket
      await websocketService.connect(user?.id || '', user?.role || '');
      setIsConnected(true);

      // Initialize WebRTC for video calls
      if (user?.role === 'proctor' || user?.role === 'supervisor') {
        await webrtcService.initialize(user.id);
      }

      // Set up event listeners
      setupEventListeners();
    } catch (error) {
      console.error('Failed to initialize realtime services:', error);
      setIsConnected(false);
    }
  };

  const setupEventListeners = () => {
    // Exam events
    window.addEventListener('exam_started', handleExamStarted);
    window.addEventListener('exam_ended', handleExamEnded);
    
    // Incident events
    window.addEventListener('incident_reported', handleIncidentReported);
    window.addEventListener('warning_issued', handleWarningIssued);
    
    // Chat events
    window.addEventListener('new_message', handleNewMessage);
    
    // Session events
    window.addEventListener('session_update', handleSessionUpdate);
    
    // AI detection events
    window.addEventListener('ai_detection', handleAIDetection);
    
    // WebRTC events
    window.addEventListener('remote_stream', handleRemoteStream);
  };

  const handleExamStarted = (event: any) => {
    const examData = event.detail;
    setLiveExams(prev => [...prev, examData]);
  };

  const handleExamEnded = (event: any) => {
    const examData = event.detail;
    setLiveExams(prev => prev.filter(exam => exam.id !== examData.examId));
  };

  const handleIncidentReported = (event: any) => {
    const incidentData = event.detail;
    setIncidents(prev => [...prev, incidentData]);
    
    // Show real-time notification
    if (user?.role === 'supervisor' || user?.role === 'admin') {
      showNotification('New Incident Reported', incidentData.description, 'error');
    }
  };

  const handleWarningIssued = (event: any) => {
    const warningData = event.detail;
    setWarnings(prev => [...prev, warningData]);
    
    // Show real-time notification
    if (user?.role === 'supervisor' || user?.role === 'admin') {
      showNotification('Warning Issued', warningData.message, 'warning');
    }
  };

  const handleNewMessage = (event: any) => {
    const messageData = event.detail;
    setRealtimeMessages(prev => [...prev, messageData]);
    
    // Show notification for new messages
    if (messageData.receiverId === user?.id) {
      showNotification('New Message', messageData.message, 'info');
    }
  };

  const handleSessionUpdate = (event: any) => {
    const sessionData = event.detail;
    setLiveSessions(prev => {
      const existingIndex = prev.findIndex(s => s.id === sessionData.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = sessionData;
        return updated;
      }
      return [...prev, sessionData];
    });
  };

  const handleAIDetection = (event: any) => {
    const detectionData = event.detail;
    
    // Show real-time AI detection alert
    if (user?.role === 'proctor' || user?.role === 'supervisor') {
      showNotification(
        'AI Detection Alert', 
        `${detectionData.type}: ${detectionData.description}`, 
        'warning'
      );
    }
  };

  const handleRemoteStream = (event: any) => {
    const { peerId, stream } = event.detail;
    // Handle incoming video stream
    window.dispatchEvent(new CustomEvent('video_stream_received', { 
      detail: { peerId, stream } 
    }));
  };

  const showNotification = (title: string, message: string, type: 'info' | 'warning' | 'error') => {
    // Create real-time notification
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
      type === 'error' ? 'bg-red-500 text-white' :
      type === 'warning' ? 'bg-yellow-500 text-white' :
      'bg-blue-500 text-white'
    }`;
    notification.innerHTML = `
      <div class="font-medium">${title}</div>
      <div class="text-sm mt-1">${message}</div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  };

  const sendMessage = (receiverId: string, message: string, type: 'text' | 'alert' | 'emergency') => {
    websocketService.sendMessage(receiverId, message, type);
  };

  const reportIncident = (incidentData: any) => {
    websocketService.reportIncident(incidentData);
  };

  const issueWarning = (sessionId: string, warningData: any) => {
    websocketService.issueWarning(sessionId, warningData);
  };

  const startVideoCall = async (peerId: string): Promise<void> => {
    try {
      const stream = await webrtcService.startLocalStream({
        video: true,
        audio: true
      });
      await webrtcService.callPeer(peerId, stream);
    } catch (error) {
      console.error('Failed to start video call:', error);
      throw error;
    }
  };

  const startScreenShare = async (): Promise<MediaStream> => {
    try {
      return await webrtcService.startScreenShare();
    } catch (error) {
      console.error('Failed to start screen share:', error);
      throw error;
    }
  };

  const cleanup = () => {
    websocketService.disconnect();
    webrtcService.disconnect();
    
    // Remove event listeners
    window.removeEventListener('exam_started', handleExamStarted);
    window.removeEventListener('exam_ended', handleExamEnded);
    window.removeEventListener('incident_reported', handleIncidentReported);
    window.removeEventListener('warning_issued', handleWarningIssued);
    window.removeEventListener('new_message', handleNewMessage);
    window.removeEventListener('session_update', handleSessionUpdate);
    window.removeEventListener('ai_detection', handleAIDetection);
    window.removeEventListener('remote_stream', handleRemoteStream);
  };

  return (
    <RealtimeContext.Provider value={{
      isConnected,
      liveExams,
      liveSessions,
      realtimeMessages,
      incidents,
      warnings,
      sendMessage,
      reportIncident,
      issueWarning,
      startVideoCall,
      startScreenShare
    }}>
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};