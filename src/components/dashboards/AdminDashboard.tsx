import React from 'react';
import { useExam } from '../../contexts/ExamContext';
import { Users, FileText, AlertTriangle, TrendingUp, Eye, Clock, Shield, Activity } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { exams, sessions } = useExam();

  const stats = [
    {
      title: 'Total Users',
      value: '1,284',
      change: '+12%',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Exams',
      value: exams.filter(e => e.status === 'active').length.toString(),
      change: '+5%',
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      title: 'Live Sessions',
      value: sessions.filter(s => s.isLive).length.toString(),
      change: '+8%',
      icon: Eye,
      color: 'bg-purple-500'
    },
    {
      title: 'Incidents Today',
      value: '7',
      change: '-15%',
      icon: AlertTriangle,
      color: 'bg-red-500'
    }
  ];

  const recentActivities = [
    { type: 'exam', message: 'New exam "Mathematics Final" created by Dr. Sarah Johnson', time: '2 minutes ago' },
    { type: 'incident', message: 'High-priority incident reported in Physics Exam Room 3', time: '5 minutes ago' },
    { type: 'user', message: '15 new students registered for upcoming exams', time: '10 minutes ago' },
    { type: 'system', message: 'AI detection system updated with improved accuracy', time: '1 hour ago' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">Complete overview of the ExamGlance platform</p>
          </div>
          <div className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-green-100 text-green-800 rounded-lg self-start sm:self-auto">
            <Shield className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-medium">All Systems Operational</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{stat.value}</p>
                <p className={`text-xs sm:text-sm mt-1 sm:mt-2 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`w-8 h-8 sm:w-12 sm:h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Live Monitoring */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Live Exam Sessions</h2>
            <div className="flex items-center space-x-2 text-green-600">
              <Activity className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Live</span>
            </div>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {sessions.filter(s => s.isLive).map((session) => (
              <div key={session.id} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{session.studentName}</p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {exams.find(e => e.id === session.examId)?.title}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-xs sm:text-sm text-gray-600">45 mins</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'incident' ? 'bg-red-500' :
                  activity.type === 'exam' ? 'bg-blue-500' :
                  activity.type === 'user' ? 'bg-green-500' : 'bg-gray-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <button className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-900 text-sm sm:text-base">Manage Users</span>
          </button>
          <button className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <FileText className="w-5 h-5 text-green-600" />
            <span className="font-medium text-gray-900 text-sm sm:text-base">Create Exam</span>
          </button>
          <button className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="font-medium text-gray-900 text-sm sm:text-base">View Incidents</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;