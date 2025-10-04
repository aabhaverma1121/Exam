import React, { useState } from 'react';
import { AlertTriangle, Search, Filter, Eye, Flag, Clock, User, FileText, CheckCircle, XCircle } from 'lucide-react';

interface Incident {
  id: string;
  sessionId: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  proctorId: string;
  proctorName: string;
  type: 'suspicious-activity' | 'technical-issue' | 'malpractice' | 'emergency';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  evidence: string[];
  status: 'open' | 'investigating' | 'resolved' | 'escalated' | 'dismissed';
  isRedFlag: boolean;
  resolution?: string;
  resolvedBy?: string;
  resolvedAt?: string;
}

const IncidentReports: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: '1',
      sessionId: 's1',
      examId: 'e1',
      examTitle: 'Mathematics Final Exam',
      studentId: 'st1',
      studentName: 'Alex Smith',
      proctorId: 'p1',
      proctorName: 'John Proctor',
      type: 'suspicious-activity',
      description: 'Student was observed looking away from screen multiple times and appeared to be reading from an external source.',
      severity: 'medium',
      timestamp: '2024-12-19T10:45:00Z',
      evidence: ['screenshot1.jpg', 'video_clip1.mp4'],
      status: 'investigating',
      isRedFlag: false
    },
    {
      id: '2',
      sessionId: 's2',
      examId: 'e1',
      examTitle: 'Mathematics Final Exam',
      studentId: 'st2',
      studentName: 'Emma Johnson',
      proctorId: 'p1',
      proctorName: 'John Proctor',
      type: 'malpractice',
      description: 'Multiple persons detected in camera feed. Student appeared to be receiving assistance from another individual.',
      severity: 'critical',
      timestamp: '2024-12-19T10:30:00Z',
      evidence: ['screenshot2.jpg', 'video_clip2.mp4', 'audio_clip1.mp3'],
      status: 'escalated',
      isRedFlag: true
    },
    {
      id: '3',
      sessionId: 's3',
      examId: 'e2',
      examTitle: 'Physics Midterm',
      studentId: 'st3',
      studentName: 'Michael Brown',
      proctorId: 'p2',
      proctorName: 'Sarah Monitor',
      type: 'technical-issue',
      description: 'Student experienced camera disconnection for 5 minutes during exam. Connection was restored.',
      severity: 'low',
      timestamp: '2024-12-18T11:15:00Z',
      evidence: ['system_log1.txt'],
      status: 'resolved',
      isRedFlag: false,
      resolution: 'Technical issue resolved. Student was given additional time to compensate for the disconnection.',
      resolvedBy: 'Admin',
      resolvedAt: '2024-12-18T11:30:00Z'
    },
    {
      id: '4',
      sessionId: 's4',
      examId: 'e2',
      examTitle: 'Physics Midterm',
      studentId: 'st4',
      studentName: 'Sarah Davis',
      proctorId: 'p2',
      proctorName: 'Sarah Monitor',
      type: 'emergency',
      description: 'Student reported feeling unwell and requested to pause the exam.',
      severity: 'high',
      timestamp: '2024-12-18T10:20:00Z',
      evidence: ['chat_log1.txt'],
      status: 'resolved',
      isRedFlag: false,
      resolution: 'Student was allowed to reschedule the exam due to medical emergency.',
      resolvedBy: 'Supervisor',
      resolvedAt: '2024-12-18T10:25:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.examTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || incident.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || incident.severity === severityFilter;
    const matchesType = typeFilter === 'all' || incident.type === typeFilter;
    return matchesSearch && matchesStatus && matchesSeverity && matchesType;
  });

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'bg-gray-100 text-gray-800',
      investigating: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      escalated: 'bg-red-100 text-red-800',
      dismissed: 'bg-gray-100 text-gray-600'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      'suspicious-activity': AlertTriangle,
      'technical-issue': FileText,
      'malpractice': Flag,
      'emergency': XCircle
    };
    return icons[type as keyof typeof icons] || AlertTriangle;
  };

  const handleStatusChange = (incidentId: string, newStatus: Incident['status']) => {
    setIncidents(incidents.map(incident => 
      incident.id === incidentId 
        ? { 
            ...incident, 
            status: newStatus,
            resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : incident.resolvedAt,
            resolvedBy: newStatus === 'resolved' ? 'Admin' : incident.resolvedBy
          }
        : incident
    ));
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
            <h1 className="text-2xl font-bold text-gray-900">Incident Reports</h1>
            <p className="text-gray-600 mt-2">Monitor and manage all exam-related incidents</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 px-3 py-2 bg-red-100 text-red-800 rounded-lg">
              <Flag className="w-4 h-4" />
              <span className="text-sm font-medium">{stats.redFlags} Red Flags</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
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
              <p className="text-3xl font-bold text-gray-900">{stats.open}</p>
            </div>
            <Clock className="w-8 h-8 text-gray-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Investigating</p>
              <p className="text-3xl font-bold text-blue-600">{stats.investigating}</p>
            </div>
            <Search className="w-8 h-8 text-blue-600" />
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search incidents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="escalated">Escalated</option>
              <option value="dismissed">Dismissed</option>
            </select>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Severity</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="suspicious-activity">Suspicious Activity</option>
              <option value="technical-issue">Technical Issue</option>
              <option value="malpractice">Malpractice</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {filteredIncidents.length} of {incidents.length} incidents
          </div>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Incident</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Student</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Exam</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Proctor</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Severity</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Time</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredIncidents.map((incident) => {
                const TypeIcon = getTypeIcon(incident.type);
                return (
                  <tr key={incident.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-start space-x-3">
                        <TypeIcon className="w-5 h-5 text-gray-600 mt-0.5" />
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-900 capitalize">
                              {incident.type.replace('-', ' ')}
                            </p>
                            {incident.isRedFlag && (
                              <Flag className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 max-w-xs truncate">
                            {incident.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-gray-900">{incident.studentName}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-900">{incident.examTitle}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-900">{incident.proctorName}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getSeverityColor(incident.severity)}`}>
                        {incident.severity}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={incident.status}
                        onChange={(e) => handleStatusChange(incident.id, e.target.value as Incident['status'])}
                        className={`px-2 py-1 rounded text-xs font-medium border-0 capitalize ${getStatusColor(incident.status)}`}
                      >
                        <option value="open">Open</option>
                        <option value="investigating">Investigating</option>
                        <option value="resolved">Resolved</option>
                        <option value="escalated">Escalated</option>
                        <option value="dismissed">Dismissed</option>
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-600">
                        {new Date(incident.timestamp).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(incident.timestamp).toLocaleTimeString()}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => setSelectedIncident(incident)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Incident Details</h3>
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
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getSeverityColor(selectedIncident.severity)}`}>
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
                <label className="block text-sm font-medium text-gray-700">Exam</label>
                <p className="text-sm text-gray-900">{selectedIncident.examTitle}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Timestamp</label>
                <p className="text-sm text-gray-900">
                  {new Date(selectedIncident.timestamp).toLocaleString()}
                </p>
              </div>
              
              {selectedIncident.evidence.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Evidence</label>
                  <div className="mt-1 space-y-1">
                    {selectedIncident.evidence.map((file, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-blue-600 hover:underline cursor-pointer">{file}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedIncident.resolution && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Resolution</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedIncident.resolution}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Resolved by {selectedIncident.resolvedBy} on {new Date(selectedIncident.resolvedAt!).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setSelectedIncident(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentReports;