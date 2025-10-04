import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useExam } from '../../contexts/ExamContext';
import { FileText, Users, Clock, BarChart3, Plus, Eye, Edit, Trash2 } from 'lucide-react';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const { exams, getExamsByTeacher, createExam } = useExam();
  const [showCreateExam, setShowCreateExam] = useState(false);
  const [newExam, setNewExam] = useState({
    title: '',
    description: '',
    duration: 60,
    totalQuestions: 10,
    startTime: '',
    endTime: ''
  });

  const teacherExams = getExamsByTeacher(user?.id || '');

  const handleCreateExam = () => {
    if (newExam.title.trim() && newExam.description.trim()) {
      createExam({
        ...newExam,
        teacherId: user?.id || '',
        teacherName: user?.name || '',
        status: 'draft',
        students: [],
        proctors: [],
        settings: {
          allowedAttempts: 1,
          enableScreenShare: true,
          enableSecondaryCamera: true,
          enableAudioMonitoring: true,
          enableAIDetection: true,
          warningLimit: 3,
          browserLockdown: true
        }
      });
      
      setNewExam({
        title: '',
        description: '',
        duration: 60,
        totalQuestions: 10,
        startTime: '',
        endTime: ''
      });
      setShowCreateExam(false);
    }
  };

  const stats = [
    {
      title: 'Total Exams',
      value: teacherExams.length.toString(),
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Exams',
      value: teacherExams.filter(e => e.status === 'active').length.toString(),
      icon: Clock,
      color: 'bg-green-500'
    },
    {
      title: 'Total Students',
      value: teacherExams.reduce((acc, exam) => acc + exam.students.length, 0).toString(),
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'Completed',
      value: teacherExams.filter(e => e.status === 'completed').length.toString(),
      icon: BarChart3,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your exams and monitor student performance</p>
          </div>
          <button
            onClick={() => setShowCreateExam(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            <span>Create Exam</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Exams List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">My Exams</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Exam Title</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Students</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Duration</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Start Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teacherExams.map((exam) => (
                <tr key={exam.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{exam.title}</p>
                      <p className="text-xs text-gray-600">{exam.description}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      exam.status === 'active' ? 'bg-green-100 text-green-800' :
                      exam.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      exam.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {exam.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{exam.students.length}</td>
                  <td className="py-3 px-4">{exam.duration} min</td>
                  <td className="py-3 px-4">
                    {new Date(exam.startTime).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-100 rounded">
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
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Exam</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newExam.title}
                  onChange={(e) => setNewExam({...newExam, title: e.target.value})}
                  className="w-full border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter exam title"
                />
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
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                  <input
                    type="number"
                    value={newExam.duration}
                    onChange={(e) => setNewExam({...newExam, duration: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Questions</label>
                  <input
                    type="number"
                    value={newExam.totalQuestions}
                    onChange={(e) => setNewExam({...newExam, totalQuestions: parseInt(e.target.value)})}
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
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;