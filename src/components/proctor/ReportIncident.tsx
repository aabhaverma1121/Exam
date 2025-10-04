import React, { useState } from 'react';
import EnhancedChat from '../shared/EnhancedChat';
import { AlertTriangle, Flag, Camera, Mic, Upload, Send, Clock, User } from 'lucide-react';

interface IncidentReport {
  studentId: string;
  studentName: string;
  type: 'suspicious-activity' | 'technical-issue' | 'malpractice' | 'emergency';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence: File[];
  timestamp: string;
  isRedFlag: boolean;
}

const ReportIncident: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [incidentType, setIncidentType] = useState<IncidentReport['type']>('suspicious-activity');
  const [severity, setSeverity] = useState<IncidentReport['severity']>('medium');
  const [description, setDescription] = useState('');
  const [evidence, setEvidence] = useState<File[]>([]);
  const [isRedFlag, setIsRedFlag] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Chat functionality
  const [chatParticipants] = useState([
    { id: 'sup1', name: 'Sarah Supervisor', role: 'supervisor' as const, status: 'online' as const },
    { id: 'sup2', name: 'Mike Supervisor', role: 'supervisor' as const, status: 'busy' as const },
    { id: 's1', name: 'Alex Smith', role: 'student' as const, status: 'online' as const },
    { id: 's2', name: 'Emma Johnson', role: 'student' as const, status: 'online' as const },
    { id: 's3', name: 'Michael Brown', role: 'student' as const, status: 'online' as const }
  ]);
  
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  const students = [
    { id: 's1', name: 'Alex Smith', status: 'active' },
    { id: 's2', name: 'Emma Johnson', status: 'warning' },
    { id: 's3', name: 'Michael Brown', status: 'flagged' },
    { id: 's4', name: 'Sarah Davis', status: 'active' }
  ];

  const incidentTypes = [
    { value: 'suspicious-activity', label: 'Suspicious Activity', icon: AlertTriangle },
    { value: 'technical-issue', label: 'Technical Issue', icon: Camera },
    { value: 'malpractice', label: 'Malpractice', icon: Flag },
    { value: 'emergency', label: 'Emergency', icon: AlertTriangle }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setEvidence(prev => [...prev, ...files]);
  };

  const removeEvidence = (index: number) => {
    setEvidence(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !description.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const report: IncidentReport = {
      studentId: selectedStudent,
      studentName: students.find(s => s.id === selectedStudent)?.name || '',
      type: incidentType,
      severity,
      description,
      evidence,
      timestamp: new Date().toISOString(),
      isRedFlag
    };

    console.log('Incident Report Submitted:', report);
    
    // Reset form
    setSelectedStudent('');
    setIncidentType('suspicious-activity');
    setSeverity('medium');
    setDescription('');
    setEvidence([]);
    setIsRedFlag(false);
    setIsSubmitting(false);
    
    alert('Incident report submitted successfully!');
  };

  const captureScreenshot = () => {
    // In a real app, this would capture the actual screen
    alert('Screenshot captured and added to evidence');
  };

  const startRecording = () => {
    // In a real app, this would start video recording
    alert('Video recording started');
  };

  const handleSendMessage = (receiverId: string, message: string, type: 'text' | 'alert' | 'emergency') => {
    const newMessage = {
      id: Date.now().toString(),
      senderId: 'current-proctor-id',
      senderName: 'You',
      receiverId,
      message,
      timestamp: new Date().toISOString(),
      type,
      isRead: false
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const handleStartCall = (participantId: string, type: 'voice' | 'video') => {
    const participant = chatParticipants.find(p => p.id === participantId);
    alert(`Starting ${type} call with ${participant?.name}`);
  };

  const getSeverityColor = (sev: string) => {
    const colors = {
      low: 'border-blue-300 bg-blue-50 text-blue-800',
      medium: 'border-yellow-300 bg-yellow-50 text-yellow-800',
      high: 'border-orange-300 bg-orange-50 text-orange-800',
      critical: 'border-red-300 bg-red-50 text-red-800'
    };
    return colors[sev as keyof typeof colors] || colors.medium;
  };

  const getStudentStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      flagged: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Report Incident</h1>
            <p className="text-gray-600 mt-2">Document and report exam incidents with evidence</p>
          </div>
          <div className="flex items-center space-x-2 px-3 py-2 bg-red-100 text-red-800 rounded-lg">
            <Flag className="w-4 h-4" />
            <span className="text-sm font-medium">INCIDENT REPORTING</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident Report Form */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Student</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {students.map((student) => (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => setSelectedStudent(student.id)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      selectedStudent === student.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900">{student.name}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStudentStatusColor(student.status)}`}>
                        {student.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Incident Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Incident Type</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {incidentTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setIncidentType(type.value as IncidentReport['type'])}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        incidentType === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900">{type.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Severity Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Severity Level</label>
              <div className="grid grid-cols-4 gap-3">
                {(['low', 'medium', 'high', 'critical'] as const).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`p-3 border rounded-lg text-center transition-colors capitalize ${
                      severity === sev
                        ? getSeverityColor(sev)
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Provide a detailed description of the incident, including what you observed, when it occurred, and any relevant context..."
                required
              />
            </div>

            {/* Evidence Collection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Evidence</label>
              <div className="space-y-3">
                {/* Quick Capture Buttons */}
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={captureScreenshot}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Capture Screenshot</span>
                  </button>
                  <button
                    type="button"
                    onClick={startRecording}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Start Recording</span>
                  </button>
                </div>

                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="evidence-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Upload evidence files
                        </span>
                        <span className="mt-1 block text-sm text-gray-600">
                          Screenshots, videos, audio recordings, or documents
                        </span>
                      </label>
                      <input
                        id="evidence-upload"
                        type="file"
                        multiple
                        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Evidence List */}
                {evidence.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Attached Evidence:</h4>
                    {evidence.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-900">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeEvidence(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Red Flag Option */}
            <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <input
                type="checkbox"
                id="red-flag"
                checked={isRedFlag}
                onChange={(e) => setIsRedFlag(e.target.checked)}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="red-flag" className="flex items-center space-x-2">
                <Flag className="w-5 h-5 text-red-600" />
                <div>
                  <span className="font-medium text-red-900">Mark as Red Flag</span>
                  <p className="text-sm text-red-700">
                    This will immediately notify supervisors and administrators
                  </p>
                </div>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!selectedStudent || !description.trim() || isSubmitting}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting Report...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Incident Report</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Quick Actions & Guidelines */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium">Issue Warning</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Flag className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium">Terminate Exam</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Camera className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium">Request Camera Check</span>
              </button>
            </div>
          </div>

          {/* Supervisor Communication */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Communications</h3>
            <EnhancedChat
              currentUserId="current-proctor-id"
              currentUserRole="proctor"
              participants={chatParticipants}
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              onStartCall={handleStartCall}
            />
          </div>

          {/* Incident Guidelines */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Reporting Guidelines</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900">When to Report:</h4>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>Suspicious behavior or movements</li>
                  <li>Multiple persons in camera view</li>
                  <li>Prohibited objects detected</li>
                  <li>Technical issues affecting monitoring</li>
                  <li>Student requests for assistance</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Red Flag Criteria:</h4>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>Clear evidence of cheating</li>
                  <li>Unauthorized assistance</li>
                  <li>Prohibited materials in use</li>
                  <li>Emergency situations</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Evidence Collection:</h4>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>Capture screenshots immediately</li>
                  <li>Record video if possible</li>
                  <li>Note exact timestamps</li>
                  <li>Document all observations</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Reports</h3>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-900">Suspicious Activity</span>
                </div>
                <p className="text-xs text-yellow-700">Alex Smith - 15 min ago</p>
              </div>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Camera className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Technical Issue</span>
                </div>
                <p className="text-xs text-blue-700">Emma Johnson - 32 min ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIncident;