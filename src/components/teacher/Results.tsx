import React, { useState } from 'react';
import { BarChart3, Download, Eye, Award, TrendingUp, Users, Clock, FileText } from 'lucide-react';

interface ExamResult {
  id: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  score: number;
  totalPoints: number;
  percentage: number;
  grade: string;
  submittedAt: string;
  timeSpent: number;
  status: 'submitted' | 'graded' | 'published';
  answers: any[];
}

const Results: React.FC = () => {
  const [selectedExam, setSelectedExam] = useState('all');
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);

  const [results] = useState<ExamResult[]>([
    {
      id: '1',
      examId: 'e1',
      examTitle: 'Mathematics Final Exam',
      studentId: 's1',
      studentName: 'Alex Smith',
      score: 85,
      totalPoints: 100,
      percentage: 85,
      grade: 'A',
      submittedAt: '2024-12-19T11:30:00Z',
      timeSpent: 115,
      status: 'published',
      answers: []
    },
    {
      id: '2',
      examId: 'e1',
      examTitle: 'Mathematics Final Exam',
      studentId: 's2',
      studentName: 'Emma Johnson',
      score: 92,
      totalPoints: 100,
      percentage: 92,
      grade: 'A+',
      submittedAt: '2024-12-19T11:25:00Z',
      timeSpent: 108,
      status: 'published',
      answers: []
    },
    {
      id: '3',
      examId: 'e2',
      examTitle: 'Physics Midterm',
      studentId: 's3',
      studentName: 'Michael Brown',
      score: 78,
      totalPoints: 100,
      percentage: 78,
      grade: 'B+',
      submittedAt: '2024-12-18T10:45:00Z',
      timeSpent: 87,
      status: 'graded',
      answers: []
    },
    {
      id: '4',
      examId: 'e2',
      examTitle: 'Physics Midterm',
      studentId: 's4',
      studentName: 'Sarah Davis',
      score: 88,
      totalPoints: 100,
      percentage: 88,
      grade: 'A-',
      submittedAt: '2024-12-18T10:30:00Z',
      timeSpent: 82,
      status: 'published',
      answers: []
    }
  ]);

  const filteredResults = selectedExam === 'all' 
    ? results 
    : results.filter(result => result.examId === selectedExam);

  const exams = [...new Set(results.map(r => ({ id: r.examId, title: r.examTitle })))];

  const stats = {
    totalResults: filteredResults.length,
    averageScore: filteredResults.reduce((sum, r) => sum + r.percentage, 0) / filteredResults.length || 0,
    highestScore: Math.max(...filteredResults.map(r => r.percentage), 0),
    lowestScore: Math.min(...filteredResults.map(r => r.percentage), 100),
    passRate: (filteredResults.filter(r => r.percentage >= 60).length / filteredResults.length) * 100 || 0
  };

  const gradeDistribution = filteredResults.reduce((acc, result) => {
    acc[result.grade] = (acc[result.grade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getGradeColor = (grade: string) => {
    const colors = {
      'A+': 'bg-green-500',
      'A': 'bg-green-400',
      'A-': 'bg-green-300',
      'B+': 'bg-blue-400',
      'B': 'bg-blue-300',
      'B-': 'bg-blue-200',
      'C+': 'bg-yellow-400',
      'C': 'bg-yellow-300',
      'C-': 'bg-yellow-200',
      'D': 'bg-orange-300',
      'F': 'bg-red-400'
    };
    return colors[grade as keyof typeof colors] || 'bg-gray-300';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      submitted: 'bg-yellow-100 text-yellow-800',
      graded: 'bg-blue-100 text-blue-800',
      published: 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Exam Results</h1>
            <p className="text-gray-600 mt-2">View and analyze student performance across all exams</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Exams</option>
              {exams.map(exam => (
                <option key={exam.id} value={exam.id}>{exam.title}</option>
              ))}
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="w-4 h-4" />
              <span>Export Results</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Results</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalResults}</p>
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
              <p className="text-sm font-medium text-gray-600">Pass Rate</p>
              <p className="text-3xl font-bold text-gray-900">{stats.passRate.toFixed(1)}%</p>
            </div>
            <Award className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Students</p>
              <p className="text-3xl font-bold text-gray-900">{filteredResults.length}</p>
            </div>
            <Users className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
          <div className="space-y-3">
            {Object.entries(gradeDistribution).map(([grade, count]) => (
              <div key={grade} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded ${getGradeColor(grade)}`}></div>
                  <span className="font-medium text-gray-900">Grade {grade}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{count} students</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getGradeColor(grade)}`}
                      style={{ width: `${(count / filteredResults.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {((count / filteredResults.length) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Score Range Analysis</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">90-100%:</span>
                  <span className="font-medium">{filteredResults.filter(r => r.percentage >= 90).length} students</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">80-89%:</span>
                  <span className="font-medium">{filteredResults.filter(r => r.percentage >= 80 && r.percentage < 90).length} students</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">70-79%:</span>
                  <span className="font-medium">{filteredResults.filter(r => r.percentage >= 70 && r.percentage < 80).length} students</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">60-69%:</span>
                  <span className="font-medium">{filteredResults.filter(r => r.percentage >= 60 && r.percentage < 70).length} students</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Below 60%:</span>
                  <span className="font-medium text-red-600">{filteredResults.filter(r => r.percentage < 60).length} students</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Time Analysis</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg. Time Spent:</span>
                  <span className="font-medium">
                    {Math.round(filteredResults.reduce((sum, r) => sum + r.timeSpent, 0) / filteredResults.length)} min
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fastest Completion:</span>
                  <span className="font-medium">{Math.min(...filteredResults.map(r => r.timeSpent))} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Slowest Completion:</span>
                  <span className="font-medium">{Math.max(...filteredResults.map(r => r.timeSpent))} min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Results</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Student</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Exam</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Score</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Grade</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Submitted</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredResults.map((result) => (
                <tr key={result.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">{result.studentName}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-gray-900">{result.examTitle}</p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{result.score}/{result.totalPoints}</span>
                      <span className="text-sm text-gray-600">({result.percentage}%)</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getGradeColor(result.grade)}`}>
                      {result.grade}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{result.timeSpent} min</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                      {result.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-gray-600">
                      {new Date(result.submittedAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelectedResult(result)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Result Detail Modal */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Result Details</h3>
              <button
                onClick={() => setSelectedResult(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Student</label>
                  <p className="text-sm text-gray-900">{selectedResult.studentName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Exam</label>
                  <p className="text-sm text-gray-900">{selectedResult.examTitle}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Score</label>
                  <p className="text-lg font-bold text-gray-900">{selectedResult.score}/{selectedResult.totalPoints}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Percentage</label>
                  <p className="text-lg font-bold text-gray-900">{selectedResult.percentage}%</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Grade</label>
                  <span className={`px-3 py-1 rounded text-sm font-medium text-white ${getGradeColor(selectedResult.grade)}`}>
                    {selectedResult.grade}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time Spent</label>
                  <p className="text-sm text-gray-900">{selectedResult.timeSpent} minutes</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Submitted At</label>
                  <p className="text-sm text-gray-900">{new Date(selectedResult.submittedAt).toLocaleString()}</p>
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
                View Full Answers
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;