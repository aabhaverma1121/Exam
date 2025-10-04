import React, { useState } from 'react';
import { BarChart3, Download, Calendar, Filter, FileText, TrendingUp, Users, AlertTriangle } from 'lucide-react';

interface ReportData {
  examTitle: string;
  date: string;
  totalStudents: number;
  completedStudents: number;
  averageScore: number;
  incidents: number;
  warnings: number;
  proctorsAssigned: number;
  duration: number;
  status: 'completed' | 'ongoing' | 'scheduled';
}

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedExam, setSelectedExam] = useState('all');
  const [reportType, setReportType] = useState('summary');

  const [reportData] = useState<ReportData[]>([
    {
      examTitle: 'Mathematics Final Exam',
      date: '2024-12-19',
      totalStudents: 45,
      completedStudents: 43,
      averageScore: 78.5,
      incidents: 3,
      warnings: 8,
      proctorsAssigned: 3,
      duration: 120,
      status: 'completed'
    },
    {
      examTitle: 'Physics Midterm',
      date: '2024-12-18',
      totalStudents: 32,
      completedStudents: 32,
      averageScore: 82.1,
      incidents: 1,
      warnings: 4,
      proctorsAssigned: 2,
      duration: 90,
      status: 'completed'
    },
    {
      examTitle: 'Chemistry Lab Assessment',
      date: '2024-12-17',
      totalStudents: 28,
      completedStudents: 26,
      averageScore: 85.3,
      incidents: 2,
      warnings: 5,
      proctorsAssigned: 2,
      duration: 60,
      status: 'completed'
    },
    {
      examTitle: 'Biology Quiz',
      date: '2024-12-20',
      totalStudents: 38,
      completedStudents: 0,
      averageScore: 0,
      incidents: 0,
      warnings: 0,
      proctorsAssigned: 2,
      duration: 45,
      status: 'scheduled'
    }
  ]);

  const completedExams = reportData.filter(exam => exam.status === 'completed');
  
  const totalStats = {
    totalExams: reportData.length,
    completedExams: completedExams.length,
    totalStudents: completedExams.reduce((sum, exam) => sum + exam.totalStudents, 0),
    averageScore: completedExams.reduce((sum, exam) => sum + exam.averageScore, 0) / completedExams.length || 0,
    totalIncidents: completedExams.reduce((sum, exam) => sum + exam.incidents, 0),
    totalWarnings: completedExams.reduce((sum, exam) => sum + exam.warnings, 0),
    completionRate: (completedExams.reduce((sum, exam) => sum + exam.completedStudents, 0) / 
                    completedExams.reduce((sum, exam) => sum + exam.totalStudents, 0)) * 100 || 0
  };

  const generateReport = () => {
    // In a real app, this would generate and download the actual report
    alert(`Generating ${reportType} report for ${selectedPeriod} period...`);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      ongoing: 'bg-blue-100 text-blue-800',
      scheduled: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Supervision Reports</h1>
            <p className="text-gray-600 mt-2">Comprehensive analytics and reporting for exam supervision</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="summary">Summary Report</option>
              <option value="detailed">Detailed Report</option>
              <option value="incidents">Incident Report</option>
              <option value="performance">Performance Report</option>
            </select>
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
            <button
              onClick={generateReport}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Exams</p>
              <p className="text-3xl font-bold text-gray-900">{totalStats.totalExams}</p>
              <p className="text-sm text-green-600 mt-1">+2 from last week</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-3xl font-bold text-gray-900">{totalStats.completionRate.toFixed(1)}%</p>
              <p className="text-sm text-green-600 mt-1">+3.2% from last week</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-3xl font-bold text-gray-900">{totalStats.averageScore.toFixed(1)}%</p>
              <p className="text-sm text-green-600 mt-1">+1.8% from last week</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Incidents</p>
              <p className="text-3xl font-bold text-gray-900">{totalStats.totalIncidents}</p>
              <p className="text-sm text-red-600 mt-1">-2 from last week</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exam Performance Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Exam Performance Overview</h3>
          <div className="space-y-4">
            {completedExams.map((exam, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{exam.examTitle}</h4>
                  <span className="text-sm text-gray-600">{exam.date}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Completion</p>
                    <p className="font-semibold text-gray-900">
                      {exam.completedStudents}/{exam.totalStudents}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Avg Score</p>
                    <p className="font-semibold text-gray-900">{exam.averageScore}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Incidents</p>
                    <p className="font-semibold text-red-600">{exam.incidents}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(exam.completedStudents / exam.totalStudents) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incident Analysis */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Incident Analysis</h3>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Incident Types</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Suspicious Activity</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-sm font-medium">3</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Technical Issues</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                    <span className="text-sm font-medium">2</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Malpractice</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                    <span className="text-sm font-medium">1</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Warning Trends</h4>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">{totalStats.totalWarnings}</p>
                <p className="text-sm text-gray-600">Total Warnings</p>
                <p className="text-xs text-green-600 mt-1">15% decrease from last period</p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Proctor Performance</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Response Time</span>
                  <span className="font-medium">2.3 min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Incidents Resolved</span>
                  <span className="font-medium">95%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Proctors</span>
                  <span className="font-medium">5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Exam Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Exam Reports</h3>
          <div className="flex items-center space-x-3">
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Exams</option>
              {reportData.map((exam, index) => (
                <option key={index} value={exam.examTitle}>{exam.examTitle}</option>
              ))}
            </select>
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Exam</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Students</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Completion</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Avg Score</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Incidents</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reportData
                .filter(exam => selectedExam === 'all' || exam.examTitle === selectedExam)
                .map((exam, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">{exam.examTitle}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{exam.date}</td>
                  <td className="py-3 px-4 text-gray-600">{exam.totalStudents}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-900">{exam.completedStudents}/{exam.totalStudents}</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(exam.completedStudents / exam.totalStudents) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900">
                      {exam.status === 'completed' ? `${exam.averageScore}%` : '-'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-red-600 font-medium">{exam.incidents}</span>
                      <span className="text-yellow-600 text-xs">({exam.warnings} warnings)</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                      {exam.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:underline text-sm">
                      View Details
                    </button>
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

export default Reports;