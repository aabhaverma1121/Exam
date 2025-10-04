import React, { useState } from 'react';
import { Camera, Maximize2, Volume2, VolumeX, AlertTriangle, Eye, User, Monitor, Smartphone } from 'lucide-react';
import ProctorFeedModal from './ProctorFeedModal';

interface VideoFeed {
  id: string;
  studentId: string;
  studentName: string;
  examTitle: string;
  sessionId: string;
  cameras: {
    primary: boolean;
    secondary: boolean;
    screen: boolean;
  };
  warnings: number;
  incidents: number;
  status: 'active' | 'warning' | 'flagged';
  duration: string;
  proctorName: string;
}

const VideoFeeds: React.FC = () => {
  const [selectedFeed, setSelectedFeed] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<'grid' | 'focus'>('grid');
  const [selectedProctor, setSelectedProctor] = useState<{ id: string; name: string } | null>(null);

  const [videoFeeds] = useState<VideoFeed[]>([
    {
      id: 'feed1',
      studentId: 's1',
      studentName: 'Alex Smith',
      examTitle: 'Mathematics Final Exam',
      sessionId: 'session1',
      cameras: { primary: true, secondary: true, screen: true },
      warnings: 1,
      incidents: 0,
      status: 'warning',
      duration: '45:23',
      proctorName: 'John Proctor'
    },
    {
      id: 'feed2',
      studentId: 's2',
      studentName: 'Emma Johnson',
      examTitle: 'Physics Midterm',
      sessionId: 'session2',
      cameras: { primary: true, secondary: false, screen: true },
      warnings: 0,
      incidents: 0,
      status: 'active',
      duration: '32:15',
      proctorName: 'Sarah Monitor'
    },
    {
      id: 'feed3',
      studentId: 's3',
      studentName: 'Michael Brown',
      examTitle: 'Chemistry Lab Assessment',
      sessionId: 'session3',
      cameras: { primary: true, secondary: true, screen: true },
      warnings: 3,
      incidents: 2,
      status: 'flagged',
      duration: '28:47',
      proctorName: 'John Proctor'
    },
    {
      id: 'feed4',
      studentId: 's4',
      studentName: 'Sarah Davis',
      examTitle: 'Biology Quiz',
      sessionId: 'session4',
      cameras: { primary: true, secondary: true, screen: false },
      warnings: 0,
      incidents: 0,
      status: 'active',
      duration: '15:32',
      proctorName: 'Mike Wilson'
    }
  ]);

  const toggleAudio = (feedId: string) => {
    setAudioEnabled(prev => ({ ...prev, [feedId]: !prev[feedId] }));
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-500',
      warning: 'bg-yellow-500',
      flagged: 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const renderVideoFeed = (feed: VideoFeed, isLarge = false) => (
    <div key={feed.id} className={`bg-white rounded-lg shadow-sm overflow-hidden ${isLarge ? 'col-span-2 row-span-2' : ''}`}>
      {/* Video Container */}
      <div className="relative bg-gray-900 aspect-video">
        <img 
          src="https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&dpr=1"
          alt={`${feed.studentName} primary camera`}
          className="w-full h-full object-cover opacity-80"
        />
        
        {/* Status Indicator */}
        <div className="absolute top-2 left-2 flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full animate-pulse ${getStatusColor(feed.status)}`}></div>
          <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">LIVE</span>
        </div>

        {/* Student Info */}
        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
          {feed.studentName}
        </div>

        {/* Camera Status */}
        <div className="absolute top-2 right-2 flex space-x-1">
          <div className={`w-2 h-2 rounded-full ${feed.cameras.primary ? 'bg-green-500' : 'bg-red-500'}`} title="Primary Camera"></div>
          <div className={`w-2 h-2 rounded-full ${feed.cameras.secondary ? 'bg-green-500' : 'bg-red-500'}`} title="Secondary Camera"></div>
          <div className={`w-2 h-2 rounded-full ${feed.cameras.screen ? 'bg-green-500' : 'bg-red-500'}`} title="Screen Share"></div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-2 right-2 flex space-x-1">
          <button
            onClick={() => toggleAudio(feed.id)}
            className="p-1 bg-black/50 text-white rounded hover:bg-black/70"
          >
            {audioEnabled[feed.id] ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
          </button>
          <button
            onClick={() => setSelectedProctor({ id: feed.id, name: feed.proctorName })}
            className="p-1 bg-black/50 text-white rounded hover:bg-black/70"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>

        {/* Warnings/Incidents Overlay */}
        {(feed.warnings > 0 || feed.incidents > 0) && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600/90 text-white px-3 py-2 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">
                {feed.warnings} warnings, {feed.incidents} incidents
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Feed Info */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-900 truncate">{feed.examTitle}</h3>
          <span className="text-sm text-gray-600">{feed.duration}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Proctor: {feed.proctorName}</span>
          <div className="flex items-center space-x-2">
            {feed.warnings > 0 && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                {feed.warnings} warnings
              </span>
            )}
            {feed.incidents > 0 && (
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                {feed.incidents} incidents
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Feeds (for large view) */}
      {isLarge && (
        <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50">
          <div className="relative bg-gray-900 aspect-video rounded">
            <img 
              src="https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=200&h=113&dpr=1"
              alt="Secondary camera"
              className="w-full h-full object-cover opacity-80 rounded"
            />
            <div className="absolute top-1 left-1 bg-black/70 text-white px-1 py-0.5 rounded text-xs">
              Mobile
            </div>
          </div>
          <div className="relative bg-gray-900 aspect-video rounded">
            <img 
              src="https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=200&h=113&dpr=1"
              alt="Screen share"
              className="w-full h-full object-cover opacity-80 rounded"
            />
            <div className="absolute top-1 left-1 bg-black/70 text-white px-1 py-0.5 rounded text-xs">
              Screen
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Live Video Feeds</h1>
            <p className="text-gray-600 mt-2">Real-time monitoring of all active exam sessions</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Grid View
              </button>
              <button
                onClick={() => setViewMode('focus')}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  viewMode === 'focus' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Focus View
              </button>
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 bg-red-100 text-red-800 rounded-lg">
              <Camera className="w-4 h-4" />
              <span className="text-sm font-medium">{videoFeeds.length} Active Feeds</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Sessions</p>
              <p className="text-3xl font-bold text-gray-900">{videoFeeds.filter(f => f.status === 'active').length}</p>
            </div>
            <Eye className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Warnings</p>
              <p className="text-3xl font-bold text-gray-900">{videoFeeds.filter(f => f.status === 'warning').length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Flagged</p>
              <p className="text-3xl font-bold text-gray-900">{videoFeeds.filter(f => f.status === 'flagged').length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cameras</p>
              <p className="text-3xl font-bold text-gray-900">{videoFeeds.length * 3}</p>
            </div>
            <Camera className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Video Feeds Grid */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videoFeeds.map(feed => renderVideoFeed(feed))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Feed */}
            <div className="lg:col-span-2">
              {selectedFeed ? 
                renderVideoFeed(videoFeeds.find(f => f.id === selectedFeed) || videoFeeds[0], true) :
                renderVideoFeed(videoFeeds[0], true)
              }
            </div>
            
            {/* Secondary Feeds */}
            <div className="space-y-4">
              {videoFeeds.slice(1, 4).map(feed => (
                <div key={feed.id} className="cursor-pointer" onClick={() => setSelectedFeed(feed.id)}>
                  {renderVideoFeed(feed)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Proctor Feed Modal */}
      {selectedProctor && (
        <ProctorFeedModal
          proctorId={selectedProctor.id}
          proctorName={selectedProctor.name}
          onClose={() => setSelectedProctor(null)}
        />
      )}
    </div>
  );
};

export default VideoFeeds;