import React, { useState } from 'react';
import { AlertTriangle, Flag, Eye, Clock, User, MessageSquare, CheckCircle, XCircle } from 'lucide-react';

interface TeacherIncident {
  id: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  proctorId: string;
  proctorName: string;
  type: 'suspicious-activity' | 'technical-issue' | 'malpractice' | 'emergency';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  status: 'open' | 'investigating' | 'resolved' | 'escalated';
  evidence: string[];
  aiConfidence?: number;
  teacherNotes?: string;
  isRedFlag: boolean;
  resolution?: string;
  impact: 'none' | 'warning' | 'grade-penalty' | 'exam-invalidated';
}

const Incidents: React.FC = () => {
  const [incidents, setIncidents] = useState<TeacherIncident[]>([
    {
      id: '1',
      examId: 'e1',
      examTitle: 'Mathematics Final Exam',
      studentId: 's1',
      studentName: 'Alex Smith',
      proctorId: 'p1',
      proctorName: 'John Proctor',
      type: 'suspicious-activity',
      severity: 'medium',
      description: 'Student observed looking away from screen multiple times. Possible external assistance detected.',
      timestamp: '2024-12-19T10:45:00Z',
      status: 'investigating',
      evidence: ['screenshot_1.jpg', 'video_clip_1.mp4'],
      aiConfidence: 85,
      isRedFlag: false,
      impact: 'warning'
    },
    {
      id: '2',
      examId: 'e1',
      examTitle: 'Mathematics Final Exam',
      studentId: 's2',
      studentName: 'Emma Johnson',
      proctorId: 'p1',
      proctorName: 'John Proctor',
      type: 'malpractice',
      severity: 'critical',
      description: 'Multiple persons detected in camera feed. Clear evidence of unauthorized assistance during exam.',
      timestamp: '2024-12-19T10:30:00Z',
      status: 'escalated',
      evidence: ['screenshot_2.jpg', 'video_clip_2.mp4', 'audio_clip_1.mp3'],
      aiConfidence: 95,
      isRedFlag: true,
      impact: 'exam-invalidated',
      resolution: 'Exam invalidated due to clear evidence of cheating. Student will need to retake under stricter supervision.'
    },
    {
      id: '3',
      examId: 'e2',
      examTitle: 'Physics Midterm',
      studentId: 's3',
      studentName: 'Michael Brown',
      proctorId: 'p2',
      proctorName: 'Sarah Monitor',
      type: 'technical-issue',
      severity: 'low',
      description: 'Camera disconnection for 3 minutes. Student reconnected successfully with no suspicious activity.',
      timestamp: '2024-12-18T11:15:00Z',
      status: 'resolved',
      evidence: ['system_log_1.txt'],
      teacherNotes: 'Technical issue confirmed. No impact on exam validity.',
      isRedFlag: false,
      impact: 'none',
      resolution: 'Technical issue resolved. No penalty applied.'
    }
  ]);

  const [selectedIncident, setSelectedIncident] = useState<TeacherIncident | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterExam, setFilterExam] = useState('all');

  const filteredIncidents = incidents.filter(incident => {
    const statusMatch = filterStatus === 'all' || incident.status === filterStatus;
    const severityMatch = filterSeverity === 'all' || incident.severity === filterSeverity;
    const examMatch = filterExam === 'all' || incident.examId === filterExam;
    return statusMatch && severityMatch && examMatch;
  });

  const exams = [...new Set(incidents.map(i => ({ id: i.examId, title: i.examTitle })))];

  const handleStatusUpdate = (incidentId: string, newStatus: TeacherIncident['status']) => {
    setIncidents(prev => prev.map(incident => 
      incident.id === incidentId ? { ...incident, status: newStatus } : incident
    ));
  };

  const handleImpactUpdate = (incidentId: string, impact: TeacherIncident['impact']) => {
    setIncidents(prev => prev.map(incident => 
      incident.id === incidentId ? { ...incident, impact } : incident
    ));
  };

  const handleAddNotes = (incidentId: string, notes: string) => {
    setIncidents(prev => prev.map(incident => 
      incident.id === incidentId ? { ...incident, teacherNotes: notes } : incident
    ));
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: 'bg-blue-100 text-blue-800 border-blue-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      critical: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'bg-gray-100 text-gray-800',
      investigating: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      escalated: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getImpactColor = (impact: string) => {
    const colors = {
      none: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      'grade-penalty': 'bg-orange-100 text-orange-800',
      'exam-invalidated': 'bg-red-100 text-red-800'
    };
    return colors[impact as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      'suspicious-activity': AlertTriangle,
      'technical-issue': Clock,
      'malpractice': Flag,
      'emergency': XCircle
    };
    return icons[type as keyof typeof icons] || AlertTriangle;
  };

  const stats = {
    total: incidents.length,
    open: incidents.filter(i => i.status === 'open').length,
    investigating: incidents.filter(i => i.status === 'investigating').length,
    resolved: incidents.filter(i => i.status === 'resolved').length,
    redFlags: incidents.filter(i => i.isRedFlag).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Exam Incidents</h1>
            <p className="text-gray-600 mt-2">Review and manage incidents from your examinations</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 px-3 py-2 bg-red-100 text-red-800 rounded-lg">
              <Flag className="w-4 h-4" />
              <span className="text-sm font-medium">{stats.redFlags} Red Flags</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Incidents</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-gray-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.open}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Investigating</p>
              <p className="text-3xl font-bold text-blue-600">{stats.investigating}</p>
            </div>
            <Eye className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Red Flags</p>
              <p className="text-3xl font-bold text-red-600">{stats.redFlags}</p>
            </div>
            <Flag className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-4">
          <select
            value={filterExam}
            onChange={(e) => setFilterExam(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Exams</option>
            {exams.map(exam => (
              <option key={exam.id} value={exam.id}>{exam.title}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="escalated">Escalated</option>
          </select>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Severity</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <div className="text-sm text-gray-600">
            {filteredIncidents.length} of {incidents.length} incidents
          </div>
        </div>
      </div>

      {/* Incidents List */}
      <div className="space-y-4">
        {filteredIncidents.map((incident) => {
          const TypeIcon = getTypeIcon(incident.type);
          return (
            <div key={incident.id} className={`bg-white rounded-lg shadow-sm border-l-4 ${
              incident.isRedFlag ? 'border-l-red-500' : 'border-l-gray-300'
            }`}>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <TypeIcon className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900 capitalize">
                          {incident.type.replace('-', ' ')}
                        </h3>
                        {incident.isRedFlag && (
                          <Flag className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(incident.severity)}`}>
                          {incident.severity}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                          {incident.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{incident.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                        <div>
                          <span className="font-medium">Student:</span> {incident.studentName}
                        </div>
                        <div>
                          <span className="font-medium">Exam:</span> {incident.examTitle}
                        </div>
                        <div>
                          <span className="font-medium">Proctor:</span> {incident.proctorName}
                        </div>
                        <div>
                          <span className="font-medium">Time:</span> {new Date(incident.timestamp).toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          {incident.aiConfidence && (
                            <span>AI Confidence: {incident.aiConfidence}%</span>
                          )}
                          <span>{incident.evidence.length} evidence files</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <select
                            value={incident.impact}
                            onChange={(e) => handleImpactUpdate(incident.id, e.target.value as TeacherIncident['impact'])}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="none">No Impact</option>
                            <option value="warning">Warning Only</option>
                            <option value="grade-penalty">Grade Penalty</option>
                            <option value="exam-invalidated">Invalidate Exam</option>
                          </select>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(incident.impact)}`}>
                            {incident.impact.replace('-', ' ')}
                          </span>
                          <button
                            onClick={() => setSelectedIncident(incident)}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                          >
                            Review
                          </button>
                        </div>
                      </div>
                      
                      {incident.teacherNotes && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-2 mb-1">
                            <MessageSquare className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">Teacher Notes</span>
                          </div>
                          <p className="text-sm text-blue-800">{incident.teacherNotes}</p>
                        </div>
                      )}
                      
                      {incident.resolution && (
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center space-x-2 mb-1">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-900">Resolution</span>
                          </div>
                          <p className="text-sm text-green-800">{incident.resolution}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Incident Review</h3>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <p className="text-sm text-gray-900 capitalize">{selectedIncident.type.replace('-', ' ')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Severity</label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(selectedIncident.severity)}`}>
                    {selectedIncident.severity}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="text-sm text-gray-900 mt-1">{selectedIncident.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Student</label>
                  <p className="text-sm text-gray-900">{selectedIncident.studentName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Proctor</label>
                  <p className="text-sm text-gray-900">{selectedIncident.proctorName}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Evidence Files</label>
                <div className="mt-1 space-y-1">
                  {selectedIncident.evidence.map((file, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-blue-600 hover:underline cursor-pointer">{file}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Impact Decision</label>
                <select
                  value={selectedIncident.impact}
                  onChange={(e) => handleImpactUpdate(selectedIncident.id, e.target.value as TeacherIncident['impact'])}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="none">No Impact - Technical/False Positive</option>
                  <option value="warning">Warning Only - Minor Violation</option>
                  <option value="grade-penalty">Grade Penalty - Moderate Violation</option>
                  <option value="exam-invalidated">Invalidate Exam - Serious Violation</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Teacher Notes</label>
                <textarea
                  value={selectedIncident.teacherNotes || ''}
                  onChange={(e) => handleAddNotes(selectedIncident.id, e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Add your assessment and decision rationale..."
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setSelectedIncident(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleAddNotes(selectedIncident.id, selectedIncident.teacherNotes || '');
                  handleStatusUpdate(selectedIncident.id, 'resolved');
                  setSelectedIncident(null);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Decision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Incidents;