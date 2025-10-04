import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useExam } from '../../contexts/ExamContext';
import { useRealtime } from '../../contexts/RealtimeContext';
import LiveVideoFeed from '../realtime/LiveVideoFeed';
import { Camera, AlertTriangle, MessageSquare, Eye, Clock, User, Flag } from 'lucide-react';

const ProctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { sessions, addWarning, addIncident } = useExam();
  const { isConnected, liveSessions, reportIncident, issueWarning } = useRealtime();
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [incidentForm, setIncidentForm] = useState({
    type: 'suspicious-activity',
    description: '',
    severity: 'medium'
  });

  const proctorSessions = sessions.filter(s => s.proctorId === user?.id && s.isLive);
  const realtimeSessions = liveSessions.filter(s => s.proctorId === user?.id);

  const handleReportIncident = (sessionId: string) => {
    if (incidentForm.description.trim()) {
      addIncident(sessionId, {
        proctorId: user?.id || '',
        type: incidentForm.type as any,
        description: incidentForm.description,
        severity: incidentForm.severity as any,
        timestamp: new Date().toISOString(),
        status: 'open',
        isRedFlag: incidentForm.severity === 'critical'
      });
      
      // Send to real-time system
      reportIncident({
        sessionId,
        proctorId: user?.id || '',
        type: incidentForm.type,
        description: incidentForm.description,
        severity: incidentForm.severity,
        timestamp: new Date().toISOString(),
        isRedFlag: incidentForm.severity === 'critical'
      });
      
      setIncidentForm({
        type: 'suspicious-activity',
        description: '',
        severity: 'medium'
      });
    }
  };

  const handleAddWarning = (sessionId: string, type: string) => {
    addWarning(sessionId, {
      type: type as any,
      message: `Warning: ${type.replace('-', ' ')} detected`,
      timestamp: new Date().toISOString(),
      aiConfidence: 0.85
    });
    
    // Send to real-time system
    issueWarning(sessionId, {
      type,
      message: `Warning: ${type.replace('-', ' ')} detected`,
      timestamp: new Date().toISOString(),
      aiConfidence: 0.85
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Proctor Station</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Monitoring {proctorSessions.length} active exam session(s)
              {isConnected && <span className="text-green-600 ml-2">• Live Connected</span>}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
              <Eye className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">MONITORING</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Student Monitoring */}
        <div className="xl:col-span-2 bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Student Feeds</h2>
            <div className="flex items-center space-x-2">
              <Camera className="w-4 h-4 text-gray-600" />
              <span className="text-xs sm:text-sm text-gray-600">{proctorSessions.length} students</span>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {proctorSessions.map((session) => (
              <LiveVideoFeed
                key={session.id}
                streamId={session.id}
                studentName={session.studentName}
                examTitle="Current Exam"
                onIncident={(type, description) => handleReportIncident(session.id)}
                onWarning={(type) => handleAddWarning(session.id, type)}
                isProctor={true}
              />
            ))}
            
            {/* Show real-time sessions if available */}
            {realtimeSessions.map((session) => (
              <LiveVideoFeed
                key={`realtime-${session.id}`}
                streamId={session.id}
                studentName={session.studentName}
                examTitle={session.examTitle}
                onIncident={(type, description) => handleReportIncident(session.id)}
                onWarning={(type) => handleAddWarning(session.id, type)}
                isProctor={true}
              />
            ))}
          </div>
          
          {proctorSessions.length === 0 && realtimeSessions.length === 0 && (
            <div className="text-center py-8">
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Sessions</h3>
              <p className="text-gray-600">
                No students are currently assigned to your monitoring station.
              </p>
            </div>
          )}
        </div>

        {/* Real-time Connection Status */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mt-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Real-time Status</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-xs sm:text-sm text-gray-600">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
          
          {!isConnected && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-800">Real-time connection lost. Attempting to reconnect...</span>
              </div>
            </div>
          )}
        </div>

        {/* Remove the old static session display */}
        <div className="hidden">
          {proctorSessions.map((session) => (
            <div key={session.id} className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-2">

                {/* Student Info and Controls */}
                <div className="p-3 sm:p-4 bg-gray-50 border-t">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <User className="w-4 h-4 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm sm:text-base">{session.studentName}</p>
                        <p className="text-xs sm:text-sm text-gray-600">Session: {session.id}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {session.warnings.length > 0 && (
                        <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{session.warnings.length}/3</span>
                        </div>
                      )}
                      
                      <button
                        onClick={() => setSelectedStudent(session.id)}
                        className="px-2 sm:px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Focus
                      </button>
                    </div>
                  </div>

                  {/* Quick Warning Buttons */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      onClick={() => handleAddWarning(session.id, 'voice-detection')}
                      className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 flex-shrink-0"
                    >
                      Voice
                    </button>
                    <button
                      onClick={() => handleAddWarning(session.id, 'multiple-persons')}
                      className="px-2 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600 flex-shrink-0"
                    >
                      Person
                    </button>
                    <button
                      onClick={() => handleAddWarning(session.id, 'eye-movement')}
                      className="px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600 flex-shrink-0"
                    >
                      Eyes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Control Panel */}
        <div className="space-y-6">
          {/* Incident Reporting */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Report Incident</h3>
              <Flag className="w-4 h-4 text-red-600" />
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Type</label>
                <select 
                  value={incidentForm.type}
                  onChange={(e) => setIncidentForm({...incidentForm, type: e.target.value})}
                  className="w-full text-xs sm:text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="suspicious-activity">Suspicious Activity</option>
                  <option value="technical-issue">Technical Issue</option>
                  <option value="malpractice">Malpractice</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Severity</label>
                <select 
                  value={incidentForm.severity}
                  onChange={(e) => setIncidentForm({...incidentForm, severity: e.target.value})}
                  className="w-full text-xs sm:text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical (Red Flag)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  value={incidentForm.description}
                  onChange={(e) => setIncidentForm({...incidentForm, description: e.target.value})}
                  placeholder="Describe the incident in detail..."
                  className="w-full text-xs sm:text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>

              <button
                onClick={() => selectedStudent && handleReportIncident(selectedStudent)}
                disabled={!selectedStudent || !incidentForm.description.trim()}
                className="w-full px-3 sm:px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
              >
                Report Incident
              </button>
            </div>
          </div>

          {/* Supervisor Communication */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Supervisor Chat</h3>
              <MessageSquare className="w-4 h-4 text-blue-600" />
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">Supervisor - 2 min ago</div>
                <p className="text-xs sm:text-sm">Please pay close attention to Student #5. There have been some concerns.</p>
              </div>

              <div className="bg-blue-100 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">You - 5 min ago</div>
                <p className="text-xs sm:text-sm">All students are behaving normally. No incidents to report.</p>
              </div>

              <div className="border rounded-lg p-3">
                <textarea 
                  placeholder="Type your message..."
                  className="w-full text-xs sm:text-sm border-0 resize-none focus:ring-0 p-0"
                  rows={2}
                />
                <button className="text-xs text-blue-600 hover:underline mt-1">Send</button>
              </div>
            </div>
          </div>

          {/* AI Alerts */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">AI Alerts</h3>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                <div>
                  <p className="text-xs sm:text-sm font-medium">Eye Movement</p>
                  <p className="text-xs text-gray-600">Student looking away detected</p>
                </div>
                <span className="text-xs text-yellow-600">85%</span>
              </div>

              <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                <div>
                  <p className="text-xs sm:text-sm font-medium">Audio Activity</p>
                  <p className="text-xs text-gray-600">Suspicious voice patterns</p>
                </div>
                <span className="text-xs text-red-600">92%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProctorDashboard;