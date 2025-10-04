import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, FileText, Download, Filter, Calendar, Award, AlertTriangle } from 'lucide-react';

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
  gradedAt: string;
  timeSpent: number; // in minutes
  warnings: number;
  incidents: number;
  status: 'submitted' | 'graded' | 'published';
}

const ResultsAnalytics: React.FC = () => {
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
      gradedAt: '2024-12-19T14:00:00Z',
      timeSpent: 115,
      warnings: 1,
      incidents: 0,
      status: 'published'
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
      gradedAt: '2024-12-19T14:15:00Z',
      timeSpent: 108,
      warnings: 0,
      incidents: 0,
      status: 'published'
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
      gradedAt: '2024-12-18T16:30:00Z',
      timeSpent: 87,
      warnings: 2,
      incidents: 1,
      status: 'published'
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
      gradedAt: '2024-12-18T16:45:00Z',
      timeSpent: 82,
      warnings: 0,
      incidents: 0,
      status: 'published'
    }
  ]);

  const [selectedExam, setSelectedExam] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Calculate analytics
  const totalResults = results.length;
  const averageScore = results.reduce((sum, result) => sum + result.percentage, 0) / totalResults;
  const passRate = (results.filter(result => result.percentage >= 60).length / totalResults) * 100;
  const totalIncidents = results.reduce((sum, result) => sum + result.incidents, 0);

  const gradeDistribution = results.reduce((acc, result) => {
    acc[result.grade] = (acc[result.grade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const examPerformance = results.reduce((acc, result) => {
    if (!acc[result.examTitle]) {
      acc[result.examTitle] = {
        totalStudents: 0,
        averageScore: 0,
        totalScore: 0,
        incidents: 0,
        warnings: 0
      };
    }
    acc[result.examTitle].totalStudents += 1;
    acc[result.examTitle].totalScore += result.percentage;
    acc[result.examTitle].incidents += result.incidents;
    acc[result.examTitle].warnings += result.warnings;
    acc[result.examTitle].averageScore = acc[result.examTitle].totalScore / acc[result.examTitle].totalStudents;
    return acc;
  }, {} as Record<string, any>);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Results & Analytics</h1>
            <p className="text-gray-600 mt-2">Comprehensive exam performance analysis and insights</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Results</p>
              <p className="text-3xl font-bold text-gray-900">{totalResults}</p>
              <p className="text-sm text-green-600 mt-1">+12% from last week</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-3xl font-bold text-gray-900">{averageScore.toFixed(1)}%</p>
              <p className="text-sm text-green-600 mt-1">+3.2% from last week</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pass Rate</p>
              <p className="text-3xl font-bold text-gray-900">{passRate.toFixed(1)}%</p>
              <p className="text-sm text-green-600 mt-1">+5.1% from last week</p>
            </div>
            <Award className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Incidents</p>
              <p className="text-3xl font-bold text-gray-900">{totalIncidents}</p>
              <p className="text-sm text-red-600 mt-1">-8% from last week</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
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
                      style={{ width: `${(count / totalResults) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {((count / totalResults) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exam Performance Comparison */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Exam Performance Comparison</h3>
          <div className="space-y-4">
            {Object.entries(examPerformance).map(([examTitle, data]) => (
              <div key={examTitle} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{examTitle}</h4>
                  <span className="text-sm text-gray-600">{data.totalStudents} students</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Avg Score</p>
                    <p className="font-semibold text-gray-900">{data.averageScore.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Warnings</p>
                    <p className="font-semibold text-yellow-600">{data.warnings}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Incidents</p>
                    <p className="font-semibold text-red-600">{data.incidents}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Results Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Results</h3>
          <div className="flex items-center space-x-3">
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Exams</option>
              {[...new Set(results.map(r => r.examTitle))].map(title => (
                <option key={title} value={title}>{title}</option>
              ))}
            </select>
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Student</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Exam</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Score</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Grade</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Time Spent</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Issues</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {results
                .filter(result => selectedExam === 'all' || result.examTitle === selectedExam)
                .map((result) => (
                <tr key={result.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">{result.studentName}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-gray-900">{result.examTitle}</p>
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
                    <span className="text-sm text-gray-900">{result.timeSpent} min</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {result.warnings > 0 && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                          {result.warnings} warnings
                        </span>
                      )}
                      {result.incidents > 0 && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                          {result.incidents} incidents
                        </span>
                      )}
                      {result.warnings === 0 && result.incidents === 0 && (
                        <span className="text-xs text-green-600">Clean</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      result.status === 'published' ? 'bg-green-100 text-green-800' :
                      result.status === 'graded' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {result.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600">
                      {new Date(result.submittedAt).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultsAnalytics;