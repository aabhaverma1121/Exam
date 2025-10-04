import React, { useState } from 'react';
import { X, Camera, Mic, Monitor, Smartphone, MessageSquare, Send, AlertTriangle, Flag } from 'lucide-react';

interface StudentFeedModalProps {
  studentId: string;
  studentName: string;
  examTitle: string;
  onClose: () => void;
}

interface AIFeedback {
  id: string;
  type: 'posture' | 'attention' | 'environment' | 'behavior';
  message: string;
  confidence: number;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

const StudentFeedModal: React.FC<StudentFeedModalProps> = ({ 
  studentId, 
  studentName, 
  examTitle, 
  onClose 
}) => {
  const [chatMessage, setChatMessage] = useState('');
  const [incidentType, setIncidentType] = useState('suspicious-activity');
  const [incidentDescription, setIncidentDescription] = useState('');

  const [aiFeedback] = useState<AIFeedback[]>([
    {
      id: '1',
      type: 'behavior',
      message: 'Student looking away from screen frequently',
      confidence: 85,
      timestamp: new Date(Date.now() - 20000).toISOString(),
      severity: 'medium'
    },
    {
      id: '2',
      type: 'environment',
      message: 'Stable environment, no suspicious activity detected',
      confidence: 95,
      timestamp: new Date(Date.now() - 50000).toISOString(),
      severity: 'low'
    },
    {
      id: '3',
      type: 'attention',
      message: 'Student maintaining focus on exam content',
      confidence: 88,
      timestamp: new Date(Date.now() - 80000).toISOString(),
      severity: 'low'
    }
  ]);

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      console.log('Sending message to student:', chatMessage);
      setChatMessage('');
    }
  };

  const handleReportIncident = () => {
    if (incidentDescription.trim()) {
      console.log('Reporting incident:', {
        studentId,
        type: incidentType,
        description: incidentDescription
      });
      setIncidentDescription('');
      alert('Incident reported successfully!');
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-red-600'
    };
    return colors[severity as keyof typeof colors] || 'text-gray-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Student: {studentName} - {examTitle}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-full">
          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Camera Feeds */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="relative bg-gray-900 aspect-video rounded-lg overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&dpr=1"
                  alt="Primary camera"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  <Camera className="w-3 h-3 inline mr-1" />
                  Primary Camera
                </div>
                <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full"></div>
              </div>

              <div className="relative bg-gray-900 aspect-video rounded-lg overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&dpr=1"
                  alt="Secondary camera"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  <Smartphone className="w-3 h-3 inline mr-1" />
                  Mobile Camera
                </div>
                <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full"></div>
              </div>

              <div className="relative bg-gray-900 aspect-video rounded-lg overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&dpr=1"
                  alt="Screen share"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  <Monitor className="w-3 h-3 inline mr-1" />
                  Screen Share
                </div>
                <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>

            {/* Recording Status */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-red-900">Live Recording in Progress</span>
                <span className="text-red-700">- Duration: 45:23</span>
              </div>
            </div>

            {/* AI Monitoring */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">AI Monitoring - Real-time Analysis</h3>
              <div className="space-y-2">
                {aiFeedback.map((feedback) => (
                  <div key={feedback.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className={`w-4 h-4 ${getSeverityColor(feedback.severity)}`} />
                      <span className="text-sm text-gray-900">{feedback.message}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-600">{feedback.confidence}% confidence</span>
                      <span className="text-xs text-gray-500">
                        {new Date(feedback.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-gray-600">
                Next analysis in: 12 seconds
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 border-l border-gray-200 p-4 space-y-4">
            {/* Chat with Student */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Chat with Student</h3>
              <div className="h-32 border rounded p-2 mb-3 overflow-y-auto bg-gray-50">
                <div className="text-sm text-gray-500 text-center">No messages yet</div>
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Message student..."
                  className="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Report Incident */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Report Incident</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Incident Type</label>
                  <select 
                    value={incidentType}
                    onChange={(e) => setIncidentType(e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="suspicious-activity">Suspicious Activity</option>
                    <option value="technical-issue">Technical Issue</option>
                    <option value="malpractice">Malpractice</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={incidentDescription}
                    onChange={(e) => setIncidentDescription(e.target.value)}
                    placeholder="Describe the incident in detail..."
                    className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                    rows={3}
                  />
                </div>
                
                <button 
                  onClick={handleReportIncident}
                  disabled={!incidentDescription.trim()}
                  className="w-full px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Flag className="w-3 h-3" />
                  <span>Report Incident</span>
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-3 py-2 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700">
                  Issue Warning
                </button>
                <button className="w-full px-3 py-2 bg-orange-600 text-white rounded text-sm hover:bg-orange-700">
                  Request Camera Check
                </button>
                <button className="w-full px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                  Terminate Exam
                </button>
              </div>
            </div>

            {/* Student Info */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Student Information</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <span className="ml-2 font-medium">{studentName}</span>
                </div>
                <div>
                  <span className="text-gray-600">Exam:</span>
                  <span className="ml-2 font-medium">{examTitle}</span>
                </div>
                <div>
                  <span className="text-gray-600">Session Time:</span>
                  <span className="ml-2 font-medium">45:23</span>
                </div>
                <div>
                  <span className="text-gray-600">Warnings:</span>
                  <span className="ml-2 font-medium text-yellow-600">1/3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentFeedModal;