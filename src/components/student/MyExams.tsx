import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useExam } from '../../contexts/ExamContext';
import ExamInterface from './ExamInterface';
import { FileText, Clock, Calendar, User, AlertTriangle, CheckCircle } from 'lucide-react';

const MyExams: React.FC = () => {
  const { user } = useAuth();
  const { getExamsByStudent } = useExam();
  const [examStarted, setExamStarted] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);

  const studentExams = getExamsByStudent(user?.id || '');

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'active':
        return <AlertTriangle className="w-4 h-4 text-green-600" />;
      case 'scheduled':
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const stats = {
    total: studentExams.length,
    completed: studentExams.filter(e => e.status === 'completed').length,
    upcoming: studentExams.filter(e => e.status === 'scheduled').length,
    active: studentExams.filter(e => e.status === 'active').length
  };

  const handleStartExam = (examId: string) => {
    setSelectedExamId(examId);
    setExamStarted(true);
  };

  const handleExitExam = () => {
    setExamStarted(false);
    setSelectedExamId(null);
  };

  // If exam is started, show the exam interface
  if (examStarted && selectedExamId) {
    return <ExamInterface examId={selectedExamId} onExitExam={handleExitExam} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Exams</h1>
            <p className="text-gray-600 mt-2">View all your assigned examinations</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">{studentExams.length}</p>
            <p className="text-sm text-gray-600">Total Exams</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Exams</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-3xl font-bold text-gray-900">{stats.upcoming}</p>
            </div>
            <Calendar className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Exams List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Exams</h2>
        
        <div className="space-y-4">
          {studentExams.map((exam) => (
            <div key={exam.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(exam.status)}
                    <h3 className="font-semibold text-gray-900">{exam.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                      {exam.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{exam.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>By {exam.teacherName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{exam.duration} minutes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>{exam.totalQuestions} questions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(exam.startTime).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-sm">
                    <p className="text-gray-600">
                      <span className="font-medium">Start:</span> {new Date(exam.startTime).toLocaleString()}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">End:</span> {new Date(exam.endTime).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  {exam.status === 'active' && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      onClick={() => handleStartExam(exam.id)}
                      Take Exam
                    </button>
                  )}
                  {exam.status === 'completed' && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      View Results
                    </button>
                  )}
                  {exam.status === 'scheduled' && (
                    <div className="text-blue-600 font-medium text-sm">
                      Starts in {Math.ceil((new Date(exam.startTime).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {studentExams.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No exams assigned</h3>
          <p className="text-gray-600">
            You don't have any exams assigned yet. Check back later or contact your instructor.
          </p>
        </div>
      )}
    </div>
  );
};

export default MyExams;