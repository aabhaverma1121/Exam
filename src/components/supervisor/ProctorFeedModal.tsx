import React, { useState } from 'react';
import { X, Camera, Mic, Monitor, Smartphone, MessageSquare, Send, Eye, AlertTriangle } from 'lucide-react';

interface ProctorFeedModalProps {
  proctorId: string;
  proctorName: string;
  onClose: () => void;
}

interface Student {
  id: string;
  name: string;
  examTitle: string;
  warnings: number;
  status: 'active' | 'warning' | 'flagged';
}

interface AIFeedback {
  id: string;
  type: 'posture' | 'attention' | 'environment' | 'behavior';
  message: string;
  confidence: number;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

const ProctorFeedModal: React.FC<ProctorFeedModalProps> = ({ proctorId, proctorName, onClose }) => {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [studentChatMessage, setStudentChatMessage] = useState('');

  const [students] = useState<Student[]>([
    { id: 's1', name: 'Alex Smith', examTitle: 'Mathematics Final', warnings: 1, status: 'warning' },
    { id: 's2', name: 'Emma Johnson', examTitle: 'Mathematics Final', warnings: 0, status: 'active' },
    { id: 's3', name: 'Michael Brown', examTitle: 'Mathematics Final', warnings: 3, status: 'flagged' }
  ]);

  const [aiFeedback] = useState<AIFeedback[]>([
    {
      id: '1',
      type: 'posture',
      message: 'Proctor maintaining good posture and alertness',
      confidence: 92,
      timestamp: new Date(Date.now() - 15000).toISOString(),
      severity: 'low'
    },
    {
      id: '2',
      type: 'attention',
      message: 'Consistent monitoring of student feeds detected',
      confidence: 88,
      timestamp: new Date(Date.now() - 45000).toISOString(),
      severity: 'low'
    }
  ]);

  const [studentAIFeedback] = useState<AIFeedback[]>([
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
    }
  ]);

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      console.log('Sending message to proctor:', chatMessage);
      setChatMessage('');
    }
  };

  const handleSendStudentMessage = () => {
    if (studentChatMessage.trim()) {
      console.log('Sending message to student:', studentChatMessage);
      setStudentChatMessage('');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-500',
      warning: 'bg-yellow-500',
      flagged: 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-red-600'
    };
    return colors[severity as keyof typeof colors] || 'text-gray-600';
  };

  if (selectedStudent) {
    const student = students.find(s => s.id === selectedStudent);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to Proctor
              </button>
              <h2 className="text-xl font-semibold text-gray-900">
                Student: {student?.name} - {student?.examTitle}
              </h2>
            </div>
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
                  {studentAIFeedback.map((feedback) => (
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
                  Next analysis in: 15 seconds
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
                    value={studentChatMessage}
                    onChange={(e) => setStudentChatMessage(e.target.value)}
                    placeholder="Message student..."
                    className="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
                  />
                  <button
                    onClick={handleSendStudentMessage}
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
                  <select className="w-full text-sm border border-gray-300 rounded px-2 py-1">
                    <option>Suspicious Activity</option>
                    <option>Technical Issue</option>
                    <option>Malpractice</option>
                    <option>Emergency</option>
                  </select>
                  <textarea
                    placeholder="Describe the incident..."
                    className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                    rows={3}
                  />
                  <button className="w-full px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                    Report Incident
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Proctor: {proctorName}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-full">
          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Proctor Camera Feeds */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="relative bg-gray-900 aspect-video rounded-lg overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&dpr=1"
                  alt="Proctor primary camera"
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
                  alt="Proctor mobile camera"
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
                  alt="Proctor screen share"
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
                <span className="text-red-700">- Duration: 1:23:45</span>
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
                Next analysis in: 8 seconds
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 border-l border-gray-200 p-4 space-y-4">
            {/* Chat with Proctor */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Chat with Proctor</h3>
              <div className="h-32 border rounded p-2 mb-3 overflow-y-auto bg-gray-50">
                <div className="text-sm text-gray-500 text-center">No messages yet</div>
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Message proctor..."
                  className="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Students List */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Students ({students.length})</h3>
              <div className="space-y-2">
                {students.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => setSelectedStudent(student.id)}
                    className="flex items-center justify-between p-2 border border-gray-200 rounded cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(student.status)}`}></div>
                      <span className="text-sm font-medium text-gray-900">{student.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {student.warnings > 0 && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                          {student.warnings} warnings
                        </span>
                      )}
                      <Eye className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProctorFeedModal;