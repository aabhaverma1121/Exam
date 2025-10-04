import React, { useState } from 'react';
import { Camera, Maximize2, Volume2, VolumeX, AlertTriangle, User, Monitor, Smartphone, Eye } from 'lucide-react';
import StudentFeedModal from './StudentFeedModal';

interface StudentFeed {
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
  status: 'active' | 'warning' | 'flagged';
  duration: string;
  lastActivity: string;
}

const CameraFeeds: React.FC = () => {
  const [selectedFeed, setSelectedFeed] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<'grid' | 'focus'>('grid');
  const [selectedStudent, setSelectedStudent] = useState<{ id: string; name: string; examTitle: string } | null>(null);

  const [studentFeeds] = useState<StudentFeed[]>([
    {
      id: 'feed1',
      studentId: 's1',
      studentName: 'Alex Smith',
      examTitle: 'Mathematics Final Exam',
      sessionId: 'session1',
      cameras: { primary: true, secondary: true, screen: true },
      warnings: 1,
      status: 'warning',
      duration: '45:23',
      lastActivity: '2 min ago'
    },
    {
      id: 'feed2',
      studentId: 's2',
      studentName: 'Emma Johnson',
      examTitle: 'Mathematics Final Exam',
      sessionId: 'session2',
      cameras: { primary: true, secondary: false, screen: true },
      warnings: 0,
      status: 'active',
      duration: '32:15',
      lastActivity: '30 sec ago'
    },
    {
      id: 'feed3',
      studentId: 's3',
      studentName: 'Michael Brown',
      examTitle: 'Mathematics Final Exam',
      sessionId: 'session3',
      cameras: { primary: true, secondary: true, screen: true },
      warnings: 3,
      status: 'flagged',
      duration: '28:47',
      lastActivity: '5 min ago'
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

  const renderStudentFeed = (feed: StudentFeed, isLarge = false) => (
    <div key={feed.id} className={`bg-white rounded-lg shadow-sm overflow-hidden ${isLarge ? 'col-span-2' : ''}`}>
      {/* Main Camera Feed */}
      <div className="relative bg-gray-900 aspect-video">
        <img 
          src="https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&dpr=1"
          alt={`${feed.studentName} primary camera`}
          className="w-full h-full object-cover opacity-80"
        />
        
        {/* Status Indicator */}
        <div className="absolute top-2 left-2 flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full animate-pulse ${getStatusColor(feed.status)}`}></div>
          <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">LIVE</span>
        </div>

        {/* Student Info */}
        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
          <div className="flex items-center space-x-2">
            <User className="w-3 h-3" />
            <span>{feed.studentName}</span>
          </div>
        </div>

        {/* Camera Status Indicators */}
        <div className="absolute top-2 right-2 flex space-x-1">
          <div 
            className={`w-3 h-3 rounded-full ${feed.cameras.primary ? 'bg-green-500' : 'bg-red-500'}`} 
            title="Primary Camera"
          ></div>
          <div 
            className={`w-3 h-3 rounded-full ${feed.cameras.secondary ? 'bg-green-500' : 'bg-red-500'}`} 
            title="Secondary Camera"
          ></div>
          <div 
            className={`w-3 h-3 rounded-full ${feed.cameras.screen ? 'bg-green-500' : 'bg-red-500'}`} 
            title="Screen Share"
          ></div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-2 right-2 flex space-x-1">
          <button
            onClick={() => toggleAudio(feed.id)}
            className="p-1 bg-black/50 text-white rounded hover:bg-black/70"
            title={audioEnabled[feed.id] ? 'Mute Audio' : 'Enable Audio'}
          >
            {audioEnabled[feed.id] ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setSelectedStudent({ 
              id: feed.studentId, 
              name: feed.studentName, 
              examTitle: feed.examTitle 
            })}
            className="p-1 bg-black/50 text-white rounded hover:bg-black/70"
            title="Focus View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Warning Overlay */}
        {feed.warnings > 0 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-red-600/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">{feed.warnings}/3 Warnings</span>
            </div>
          </div>
        )}
      </div>

      {/* Feed Information */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-900">{feed.studentName}</h3>
          <span className="text-sm text-gray-600">{feed.duration}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <span>Session: {feed.sessionId}</span>
          <span>Last activity: {feed.lastActivity}</span>
        </div>

        {/* Warning Status */}
        {feed.warnings > 0 && (
          <div className={`px-3 py-2 rounded-lg mb-3 ${
            feed.warnings >= 3 ? 'bg-red-100 text-red-800' : 
            feed.warnings >= 2 ? 'bg-orange-100 text-orange-800' : 
            'bg-yellow-100 text-yellow-800'
          }`}>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">
                {feed.warnings >= 3 ? 'EXAM TERMINATED' : 
                 feed.warnings >= 2 ? 'FINAL WARNING' : 
                 'WARNING ISSUED'}
              </span>
            </div>
          </div>
        )}

        {/* Camera Status Grid */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className={`p-2 rounded text-center ${feed.cameras.primary ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <Camera className="w-4 h-4 mx-auto mb-1" />
            <span>Primary</span>
          </div>
          <div className={`p-2 rounded text-center ${feed.cameras.secondary ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <Smartphone className="w-4 h-4 mx-auto mb-1" />
            <span>Mobile</span>
          </div>
          <div className={`p-2 rounded text-center ${feed.cameras.screen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <Monitor className="w-4 h-4 mx-auto mb-1" />
            <span>Screen</span>
          </div>
        </div>
      </div>

      {/* Secondary Feeds (for large view) */}
      {isLarge && (
        <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50">
          <div className="relative bg-gray-900 aspect-video rounded">
            <img 
              src="https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=200&h=113&dpr=1"
              alt="Secondary camera"
              className="w-full h-full object-cover opacity-80 rounded"
            />
            <div className="absolute top-1 left-1 bg-black/70 text-white px-2 py-1 rounded text-xs">
              <Smartphone className="w-3 h-3 inline mr-1" />
              Mobile Camera
            </div>
            <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${feed.cameras.secondary ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </div>
          
          <div className="relative bg-gray-900 aspect-video rounded">
            <img 
              src="https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=200&h=113&dpr=1"
              alt="Screen share"
              className="w-full h-full object-cover opacity-80 rounded"
            />
            <div className="absolute top-1 left-1 bg-black/70 text-white px-2 py-1 rounded text-xs">
              <Monitor className="w-3 h-3 inline mr-1" />
              Screen Share
            </div>
            <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${feed.cameras.screen ? 'bg-green-500' : 'bg-red-500'}`}></div>
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
            <h1 className="text-2xl font-bold text-gray-900">Camera Feeds</h1>
            <p className="text-gray-600 mt-2">Monitor all assigned students in real-time</p>
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
            <div className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">{studentFeeds.length} Students</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Students</p>
              <p className="text-3xl font-bold text-gray-900">{studentFeeds.filter(f => f.status === 'active').length}</p>
            </div>
            <User className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Warnings Issued</p>
              <p className="text-3xl font-bold text-gray-900">{studentFeeds.filter(f => f.status === 'warning').length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Flagged Students</p>
              <p className="text-3xl font-bold text-gray-900">{studentFeeds.filter(f => f.status === 'flagged').length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cameras</p>
              <p className="text-3xl font-bold text-gray-900">{studentFeeds.length * 3}</p>
            </div>
            <Camera className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Camera Feeds */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {studentFeeds.map(feed => renderStudentFeed(feed))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Feed */}
            <div className="lg:col-span-2">
              {selectedFeed ? 
                renderStudentFeed(studentFeeds.find(f => f.id === selectedFeed) || studentFeeds[0], true) :
                renderStudentFeed(studentFeeds[0], true)
              }
            </div>
            
            {/* Secondary Feeds */}
            <div className="space-y-4">
              {studentFeeds.slice(1).map(feed => (
                <div key={feed.id} className="cursor-pointer" onClick={() => setSelectedFeed(feed.id)}>
                  {renderStudentFeed(feed)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Detection Alerts */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent AI Detections</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-900">Eye Movement Detection</p>
                <p className="text-sm text-yellow-700">Alex Smith - Looking away from screen detected</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-yellow-900">85% confidence</p>
              <p className="text-xs text-yellow-600">2 min ago</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-red-900">Multiple Persons Detected</p>
                <p className="text-sm text-red-700">Michael Brown - Additional person in frame</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-red-900">92% confidence</p>
              <p className="text-xs text-red-600">5 min ago</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              <Camera className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Camera Disconnection</p>
                <p className="text-sm text-blue-700">Emma Johnson - Secondary camera offline</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-blue-900">Technical Issue</p>
              <p className="text-xs text-blue-600">8 min ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Student Feed Modal */}
      {selectedStudent && (
        <StudentFeedModal
          studentId={selectedStudent.id}
          studentName={selectedStudent.name}
          examTitle={selectedStudent.examTitle}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
};

export default CameraFeeds;