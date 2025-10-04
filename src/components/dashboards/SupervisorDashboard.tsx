import React, { useState } from 'react';
import { useExam } from '../../contexts/ExamContext';
import { useRealtime } from '../../contexts/RealtimeContext';
import LiveVideoFeed from '../realtime/LiveVideoFeed';
import { Monitor, Camera, MessageSquare, AlertTriangle, Eye, Users, Activity } from 'lucide-react';

const SupervisorDashboard: React.FC = () => {
  const { sessions, exams } = useExam();
  const { isConnected, liveSessions: realtimeLiveSessions, incidents, warnings } = useRealtime();
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const liveSessions = sessions.filter(s => s.isLive);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Supervisor Control Center</h1>
            <p className="text-gray-600 mt-2">
              Real-time monitoring of all exam sessions
              {isConnected && <span className="text-green-600 ml-2">• Live Connected</span>}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg">
              <Activity className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-medium">LIVE MONITORING</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{liveSessions.length + realtimeLiveSessions.length}</p>
              <p className="text-sm text-gray-600">Active Sessions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Feeds Grid */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Live Video Feeds</h2>
            <div className="flex items-center space-x-2">
              <Camera className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">{liveSessions.length + realtimeLiveSessions.length} cameras active</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveSessions.map((session) => (
              <LiveVideoFeed
                key={session.id}
                streamId={session.id}
                studentName={session.studentName}
                examTitle={exams.find(e => e.id === session.examId)?.title || 'Unknown Exam'}
                isProctor={false}
              />
            ))}
            
            {/* Real-time sessions */}
            {realtimeLiveSessions.map((session) => (
              <LiveVideoFeed
                key={`realtime-${session.id}`}
                streamId={session.id}
                studentName={session.studentName}
                examTitle={session.examTitle}
                isProctor={false}
              />
            ))}
          </div>
        </div>

        {/* Control Panel */}
        <div className="space-y-6">
          {/* Communication Panel */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Communications</h3>
              <MessageSquare className="w-4 h-4 text-gray-600" />
            </div>
            
            <div className="space-y-3">
              <div className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Proctor Chat</span>
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
                <textarea 
                  placeholder="Send message to proctors..."
                  className="w-full text-sm border-0 resize-none focus:ring-0 p-0"
                  rows={2}
                />
                <button className="text-xs text-blue-600 hover:underline mt-1">Send</button>
              </div>

              <div className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Student Chat</span>
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                </div>
                <textarea 
                  placeholder="Send message to students..."
                  className="w-full text-sm border-0 resize-none focus:ring-0 p-0"
                  rows={2}
                />
                <button className="text-xs text-blue-600 hover:underline mt-1">Send</button>
              </div>
            </div>
          </div>

          {/* Active Incidents */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Active Incidents</h3>
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            
            <div className="space-y-3">
              <div className="border-l-4 border-yellow-400 bg-yellow-50 p-3 rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Suspicious Activity</p>
                    <p className="text-xs text-gray-600">Student: Alex Smith</p>
                  </div>
                  <span className="text-xs text-yellow-600">Medium</span>
                </div>
              </div>
              
              <div className="border-l-4 border-red-400 bg-red-50 p-3 rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Multiple Persons Detected</p>
                    <p className="text-xs text-gray-600">Student: Emma Johnson</p>
                  </div>
                  <span className="text-xs text-red-600">High</span>
                </div>
              </div>
              
              {/* Real-time incidents */}
              {incidents.slice(0, 3).map((incident) => (
                <div key={incident.id} className="border-l-4 border-red-400 bg-red-50 p-3 rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{incident.type.replace('-', ' ')}</p>
                      <p className="text-xs text-gray-600">Real-time: {incident.description}</p>
                    </div>
                    <span className="text-xs text-red-600">{incident.severity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Session Statistics */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Session Overview</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Sessions</span>
                <span className="font-medium">{sessions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Now</span>
                <span className="font-medium text-green-600">{liveSessions.length + realtimeLiveSessions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Incidents Today</span>
                <span className="font-medium text-red-600">{incidents.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg. Session Time</span>
                <span className="font-medium">45 min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;