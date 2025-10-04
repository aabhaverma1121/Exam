import React, { useState } from 'react';
import { FileText, Plus, Search, Calendar, Users, Clock, Settings, Eye, Edit, Trash2, Copy } from 'lucide-react';

interface Exam {
  id: string;
  title: string;
  description: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  duration: number;
  totalQuestions: number;
  startTime: string;
  endTime: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'cancelled';
  studentsAssigned: number;
  proctorsAssigned: number;
  settings: {
    allowedAttempts: number;
    enableScreenShare: boolean;
    enableSecondaryCamera: boolean;
    enableAudioMonitoring: boolean;
    enableAIDetection: boolean;
    warningLimit: number;
    browserLockdown: boolean;
  };
  createdAt: string;
}

const ExamManagement: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([
    {
      id: '1',
      title: 'Mathematics Final Exam',
      description: 'Comprehensive mathematics examination covering algebra, geometry, and calculus',
      subject: 'Mathematics',
      teacherId: '4',
      teacherName: 'Dr. Emily Johnson',
      duration: 120,
      totalQuestions: 50,
      startTime: '2024-12-20T14:00:00Z',
      endTime: '2024-12-20T16:00:00Z',
      status: 'scheduled',
      studentsAssigned: 45,
      proctorsAssigned: 3,
      settings: {
        allowedAttempts: 1,
        enableScreenShare: true,
        enableSecondaryCamera: true,
        enableAudioMonitoring: true,
        enableAIDetection: true,
        warningLimit: 3,
        browserLockdown: true
      },
      createdAt: '2024-12-15T00:00:00Z'
    },
    {
      id: '2',
      title: 'Physics Midterm',
      description: 'Physics examination covering mechanics, thermodynamics, and electromagnetism',
      subject: 'Physics',
      teacherId: '5',
      teacherName: 'Prof. Michael Brown',
      duration: 90,
      totalQuestions: 35,
      startTime: '2024-12-19T10:00:00Z',
      endTime: '2024-12-19T11:30:00Z',
      status: 'active',
      studentsAssigned: 32,
      proctorsAssigned: 2,
      settings: {
        allowedAttempts: 1,
        enableScreenShare: true,
        enableSecondaryCamera: true,
        enableAudioMonitoring: true,
        enableAIDetection: true,
        warningLimit: 3,
        browserLockdown: true
      },
      createdAt: '2024-12-10T00:00:00Z'
    },
    {
      id: '3',
      title: 'Chemistry Lab Assessment',
      description: 'Practical chemistry assessment with theoretical questions',
      subject: 'Chemistry',
      teacherId: '6',
      teacherName: 'Dr. Sarah Wilson',
      duration: 60,
      totalQuestions: 25,
      startTime: '2024-12-18T09:00:00Z',
      endTime: '2024-12-18T10:00:00Z',
      status: 'completed',
      studentsAssigned: 28,
      proctorsAssigned: 2,
      settings: {
        allowedAttempts: 1,
        enableScreenShare: true,
        enableSecondaryCamera: false,
        enableAudioMonitoring: true,
        enableAIDetection: true,
        warningLimit: 3,
        browserLockdown: true
      },
      createdAt: '2024-12-12T00:00:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [showCreateExam, setShowCreateExam] = useState(false);

  const [newExam, setNewExam] = useState({
    title: '',
    description: '',
    subject: '',
    teacherId: '',
    duration: 60,
    totalQuestions: 10,
    startTime: '',
    endTime: ''
  });

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || exam.status === statusFilter;
    const matchesSubject = subjectFilter === 'all' || exam.subject === subjectFilter;
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleCreateExam = () => {
    if (newExam.title && newExam.description && newExam.subject) {
      const exam: Exam = {
        id: Date.now().toString(),
        ...newExam,
        teacherName: 'Selected Teacher',
        status: 'draft',
        studentsAssigned: 0,
        proctorsAssigned: 0,
        settings: {
          allowedAttempts: 1,
          enableScreenShare: true,
          enableSecondaryCamera: true,
          enableAudioMonitoring: true,
          enableAIDetection: true,
          warningLimit: 3,
          browserLockdown: true
        },
        createdAt: new Date().toISOString()
      };
      setExams([...exams, exam]);
      setNewExam({
        title: '',
        description: '',
        subject: '',
        teacherId: '',
        duration: 60,
        totalQuestions: 10,
        startTime: '',
        endTime: ''
      });
      setShowCreateExam(false);
    }
  };

  const handleDeleteExam = (examId: string) => {
    setExams(exams.filter(exam => exam.id !== examId));
  };

  const handleDuplicateExam = (exam: Exam) => {
    const duplicatedExam: Exam = {
      ...exam,
      id: Date.now().toString(),
      title: `${exam.title} (Copy)`,
      status: 'draft',
      studentsAssigned: 0,
      proctorsAssigned: 0,
      createdAt: new Date().toISOString()
    };
    setExams([...exams, duplicatedExam]);
  };

  const subjects = [...new Set(exams.map(exam => exam.subject))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Exam Management</h1>
            <p className="text-gray-600 mt-2">Create, schedule, and manage all examinations</p>
          </div>
          <button
            onClick={() => setShowCreateExam(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Create Exam</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Exams</p>
              <p className="text-3xl font-bold text-gray-900">{exams.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Exams</p>
              <p className="text-3xl font-bold text-gray-900">{exams.filter(e => e.status === 'active').length}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-3xl font-bold text-gray-900">{exams.filter(e => e.status === 'scheduled').length}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-gray-900">{exams.filter(e => e.status === 'completed').length}</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
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
                placeholder="Search exams..."
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
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {filteredExams.length} of {exams.length} exams
          </div>
        </div>
      </div>

      {/* Exams Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Exam Details</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Teacher</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Schedule</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Participants</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{exam.title}</p>
                      <p className="text-sm text-gray-600">{exam.subject}</p>
                      <p className="text-xs text-gray-500 mt-1">{exam.totalQuestions} questions • {exam.duration} min</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm font-medium text-gray-900">{exam.teacherName}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      <p className="text-gray-900">{new Date(exam.startTime).toLocaleDateString()}</p>
                      <p className="text-gray-600">{new Date(exam.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      <p className="text-gray-900">{exam.studentsAssigned} students</p>
                      <p className="text-gray-600">{exam.proctorsAssigned} proctors</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(exam.status)}`}>
                      {exam.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-purple-600 hover:bg-purple-100 rounded">
                        <Settings className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicateExam(exam)}
                        className="p-1 text-orange-600 hover:bg-orange-100 rounded"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteExam(exam.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Exam Modal */}
      {showCreateExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Exam</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exam Title</label>
                  <input
                    type="text"
                    value={newExam.title}
                    onChange={(e) => setNewExam({...newExam, title: e.target.value})}
                    className="w-full border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter exam title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={newExam.subject}
                    onChange={(e) => setNewExam({...newExam, subject: e.target.value})}
                    className="w-full border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter subject"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newExam.description}
                  onChange={(e) => setNewExam({...newExam, description: e.target.value})}
                  className="w-full border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Enter exam description"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={newExam.duration}
                    onChange={(e) => setNewExam({...newExam, duration: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Questions</label>
                  <input
                    type="number"
                    value={newExam.totalQuestions}
                    onChange={(e) => setNewExam({...newExam, totalQuestions: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
                  <select
                    value={newExam.teacherId}
                    onChange={(e) => setNewExam({...newExam, teacherId: e.target.value})}
                    className="w-full border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Teacher</option>
                    <option value="4">Dr. Emily Johnson</option>
                    <option value="5">Prof. Michael Brown</option>
                    <option value="6">Dr. Sarah Wilson</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="datetime-local"
                    value={newExam.startTime}
                    onChange={(e) => setNewExam({...newExam, startTime: e.target.value})}
                    className="w-full border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="datetime-local"
                    value={newExam.endTime}
                    onChange={(e) => setNewExam({...newExam, endTime: e.target.value})}
                    className="w-full border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateExam(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateExam}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamManagement;