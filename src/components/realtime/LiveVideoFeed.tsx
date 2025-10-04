import React, { useEffect, useRef, useState } from 'react';
import { Camera, Mic, Monitor, Volume2, VolumeX, Maximize2, AlertTriangle } from 'lucide-react';

interface LiveVideoFeedProps {
  streamId: string;
  studentName: string;
  examTitle: string;
  onIncident?: (type: string, description: string) => void;
  onWarning?: (type: string) => void;
  isProctor?: boolean;
}

const LiveVideoFeed: React.FC<LiveVideoFeedProps> = ({
  streamId,
  studentName,
  examTitle,
  onIncident,
  onWarning,
  isProctor = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [warnings, setWarnings] = useState<string[]>([]);

  useEffect(() => {
    initializeVideoStream();
    
    return () => {
      cleanup();
    };
  }, [streamId]);

  const initializeVideoStream = async () => {
    try {
      setConnectionStatus('connecting');
      
      // Simulate real video stream initialization
      if (videoRef.current) {
        // In a real implementation, this would connect to actual WebRTC stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setConnectionStatus('connected');
        
        // Simulate AI monitoring
        startAIMonitoring();
      }
    } catch (error) {
      console.error('Failed to initialize video stream:', error);
      setConnectionStatus('disconnected');
    }
  };

  const startAIMonitoring = () => {
    // Simulate AI detection alerts
    const detectionTypes = [
      'eye-movement',
      'multiple-persons',
      'prohibited-object',
      'voice-detection',
      'posture-change'
    ];

    const interval = setInterval(() => {
      if (Math.random() > 0.95) { // 5% chance of detection
        const detectionType = detectionTypes[Math.floor(Math.random() * detectionTypes.length)];
        const confidence = Math.floor(Math.random() * 30) + 70; // 70-100% confidence
        
        if (confidence > 85) {
          setWarnings(prev => [...prev, detectionType]);
          onWarning?.(detectionType);
          
          // Auto-remove warning after 5 seconds
          setTimeout(() => {
            setWarnings(prev => prev.filter(w => w !== detectionType));
          }, 5000);
        }
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  };

  const cleanup = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    if (videoRef.current) {
      videoRef.current.muted = isAudioEnabled;
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen && videoRef.current) {
      videoRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'disconnected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Video Container */}
      <div className="relative bg-gray-900 aspect-video">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted={!isAudioEnabled}
          playsInline
        />
        
        {/* Status Indicators */}
        <div className="absolute top-2 left-2 flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full animate-pulse ${getConnectionStatusColor()}`}></div>
          <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
            {connectionStatus === 'connected' ? 'LIVE' : connectionStatus.toUpperCase()}
          </span>
        </div>

        {/* Student Info */}
        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
          <div className="flex items-center space-x-2">
            <Camera className="w-3 h-3" />
            <span>{studentName}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-2 right-2 flex space-x-1">
          <button
            onClick={toggleAudio}
            className="p-2 bg-black/50 text-white rounded hover:bg-black/70 transition-colors"
            title={isAudioEnabled ? 'Mute Audio' : 'Enable Audio'}
          >
            {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-black/50 text-white rounded hover:bg-black/70 transition-colors"
            title="Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* AI Warning Overlays */}
        {warnings.length > 0 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-red-600/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2 animate-pulse">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">AI Detection: {warnings[0].replace('-', ' ')}</span>
            </div>
          </div>
        )}

        {/* Connection Status Overlay */}
        {connectionStatus !== 'connected' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p className="text-sm">{connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Feed Information */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-900 text-sm sm:text-base">{studentName}</h3>
          <span className="text-xs sm:text-sm text-gray-600">Session: {streamId}</span>
        </div>
        
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-3">
          <span>{examTitle}</span>
          <span>Duration: 45:23</span>
        </div>

        {/* Camera Status Grid */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="p-2 rounded text-center bg-green-100 text-green-800">
            <Camera className="w-4 h-4 mx-auto mb-1" />
            <span>Primary</span>
          </div>
          <div className="p-2 rounded text-center bg-green-100 text-green-800">
            <Mic className="w-4 h-4 mx-auto mb-1" />
            <span>Audio</span>
          </div>
          <div className="p-2 rounded text-center bg-green-100 text-green-800">
            <Monitor className="w-4 h-4 mx-auto mb-1" />
            <span>Screen</span>
          </div>
        </div>

        {/* Proctor Controls */}
        {isProctor && (
          <div className="mt-3 flex space-x-2">
            <button
              onClick={() => onWarning?.('suspicious-activity')}
              className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600"
            >
              Warning
            </button>
            <button
              onClick={() => onIncident?.('malpractice', 'Suspicious activity detected')}
              className="flex-1 px-3 py-2 bg-red-500 text-white rounded text-xs hover:bg-red-600"
            >
              Incident
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveVideoFeed;