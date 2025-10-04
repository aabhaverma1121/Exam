import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { BarChart3, Award, Clock, FileText, Eye, Download, TrendingUp } from 'lucide-react';

interface StudentResult {
  id: string;
  examId: string;
  examTitle: string;
  teacherName: string;
  score: number;
  totalPoints: number;
  percentage: number;
  grade: string;
  submittedAt: string;
  timeSpent: number;
  status: 'graded' | 'published';
  feedback?: string;
  rank?: number;
  totalStudents?: number;
}

const Results: React.FC = () => {
  const { user } = useAuth();
  const [selectedResult, setSelectedResult] = useState<StudentResult | null>(null);

  const [results] = useState<StudentResult[]>([
    {
      id: '1',
      examId: 'e1',
      examTitle: 'General Knowledge Test',
      teacherName: 'Dr. Sarah Johnson',
      score: 85,
      totalPoints: 100,
      percentage: 85,
      grade: 'A',
      submittedAt: '2024-12-19T11:30:00Z',
      timeSpent: 55,
      status: 'published',
      feedback: 'Excellent performance! You demonstrated strong understanding of the concepts.',
      rank: 3,
      totalStudents: 25
    },
    {
      id: '2',
      examId: 'e2',
      examTitle: 'Mathematics Final Exam',
      teacherName: 'Dr. Sarah Johnson',
      score: 92,
      totalPoints: 100,
      percentage: 92,
      grade: 'A+',
      submittedAt: '2024-12-18T16:00:00Z',
      timeSpent: 118,
      status: 'published',
      feedback: 'Outstanding work! Your problem-solving approach was methodical and accurate.',
      rank: 1,
      totalStudents: 30
    },
    {
      id: '3',
      examId: 'e3',
      examTitle: 'Physics Midterm',
      teacherName: 'Prof. Michael Brown',
      score: 78,
      totalPoints: 100,
      percentage: 78,
      grade: 'B+',
      submittedAt: '2024-12-17T11:30:00Z',
      timeSpent: 87,
      status: 'published',
      feedback: 'Good understanding of basic concepts. Focus more on complex problem-solving.',
      rank: 8,
      totalStudents: 28
    }
  ]);

  const getGradeColor = (grade: string) => {
    const colors = {
      'A+': 'bg-green-500 text-white',
      'A': 'bg-green-400 text-white',
      'A-': 'bg-green-300 text-white',
      'B+': 'bg-blue-400 text-white',
      'B': 'bg-blue-300 text-white',
      'B-': 'bg-blue-200 text-white',
      'C+': 'bg-yellow-400 text-white',
      'C': 'bg-yellow-300 text-white',
      'C-': 'bg-yellow-200 text-gray-800',
      'D': 'bg-orange-300 text-white',
      'F': 'bg-red-400 text-white'
    };
    return colors[grade as keyof typeof colors] || 'bg-gray-300 text-gray-800';
  };

  const stats = {
    totalExams: results.length,
    averageScore: results.reduce((sum, r) => sum + r.percentage, 0) / results.length,
    highestScore: Math.max(...results.map(r => r.percentage)),
    averageRank: results.reduce((sum, r) => sum + (r.rank || 0), 0) / results.length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Results</h1>
            <p className="text-gray-600 mt-2">View your exam performance and grades</p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Exams</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalExams}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-3xl font-bold text-gray-900">{stats.averageScore.toFixed(1)}%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Highest Score</p>
              <p className="text-3xl font-bold text-gray-900">{stats.highestScore}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rank</p>
              <p className="text-3xl font-bold text-gray-900">{stats.averageRank.toFixed(0)}</p>
            </div>
            <Award className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Exam Results</h2>
        
        <div className="space-y-4">
          {results.map((result) => (
            <div key={result.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="font-semibold text-gray-900">{result.examTitle}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(result.grade)}`}>
                      {result.grade}
                    </span>
                    {result.rank && result.rank <= 3 && (
                      <Award className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-3">Instructor: {result.teacherName}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Score:</span>
                      <p className="font-semibold text-gray-900">{result.score}/{result.totalPoints} ({result.percentage}%)</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Time Spent:</span>
                      <p className="font-semibold text-gray-900">{result.timeSpent} minutes</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Rank:</span>
                      <p className="font-semibold text-gray-900">
                        {result.rank ? `${result.rank} of ${result.totalStudents}` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Submitted:</span>
                      <p className="font-semibold text-gray-900">{new Date(result.submittedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {result.feedback && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-900">
                        <span className="font-medium">Feedback:</span> {result.feedback}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="ml-6">
                  <button
                    onClick={() => setSelectedResult(result)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Trend</h2>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Performance chart would be displayed here</p>
          </div>
        </div>
      </div>

      {/* Result Detail Modal */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Detailed Results</h3>
              <button
                onClick={() => setSelectedResult(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-2">{selectedResult.examTitle}</h4>
                <div className="flex items-center justify-center space-x-4">
                  <span className={`px-4 py-2 rounded-full text-lg font-bold ${getGradeColor(selectedResult.grade)}`}>
                    {selectedResult.grade}
                  </span>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{selectedResult.percentage}%</p>
                    <p className="text-sm text-gray-600">{selectedResult.score}/{selectedResult.totalPoints} points</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900">Time Performance</span>
                  </div>
                  <p className="text-sm text-gray-600">Time Spent: {selectedResult.timeSpent} minutes</p>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900">Class Ranking</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {selectedResult.rank ? `${selectedResult.rank} of ${selectedResult.totalStudents}` : 'Not available'}
                  </p>
                </div>
              </div>
              
              {selectedResult.feedback && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">Instructor Feedback</h5>
                  <p className="text-sm text-blue-800">{selectedResult.feedback}</p>
                </div>
              )}
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Exam Information</h5>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Instructor:</span> {selectedResult.teacherName}</p>
                  <p><span className="font-medium">Submitted:</span> {new Date(selectedResult.submittedAt).toLocaleString()}</p>
                  <p><span className="font-medium">Status:</span> {selectedResult.status}</p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setSelectedResult(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                Close
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Download Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {results.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Available</h3>
          <p className="text-gray-600">
            Your exam results will appear here once they are graded and published.
          </p>
        </div>
      )}
    </div>
  );
};

export default Results;