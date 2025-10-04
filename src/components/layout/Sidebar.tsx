import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  Shield, 
  Monitor, 
  BookOpen, 
  GraduationCap,
  AlertTriangle,
  MessageSquare,
  BarChart3,
  Camera
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const getMenuItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', href: '#dashboard' },
          { icon: Users, label: 'User Management', href: '#user-management' },
          { icon: FileText, label: 'Exam Management', href: '#exam-management' },
          { icon: BarChart3, label: 'Results & Analytics', href: '#results-analytics' },
          { icon: AlertTriangle, label: 'Incident Reports', href: '#incident-reports' },
          { icon: Settings, label: 'System Settings', href: '#system-settings' }
        ];
      case 'supervisor':
        return [
          { icon: Monitor, label: 'Live Monitoring', href: '#dashboard' },
          { icon: Camera, label: 'Video Feeds', href: '#video-feeds' },
          { icon: MessageSquare, label: 'Communications', href: '#communications' },
          { icon: AlertTriangle, label: 'Incidents', href: '#incidents' },
          { icon: BarChart3, label: 'Reports', href: '#reports' }
        ];
      case 'proctor':
        return [
          { icon: Monitor, label: 'Student Monitoring', href: '#dashboard' },
          { icon: Camera, label: 'Camera Feeds', href: '#camera-feeds' },
          { icon: AlertTriangle, label: 'Report Incident', href: '#report-incident' },
          { icon: MessageSquare, label: 'Supervisor Chat', href: '#supervisor-chat' }
        ];
      case 'teacher':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', href: '#dashboard' },
          { icon: FileText, label: 'My Exams', href: '#my-exams' },
          { icon: BookOpen, label: 'Create Exam', href: '#create-exam' },
          { icon: BarChart3, label: 'Results', href: '#results' },
          { icon: AlertTriangle, label: 'Incidents', href: '#incidents' }
        ];
      case 'student':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', href: '#dashboard' },
          { icon: FileText, label: 'My Exams', href: '#my-exams' },
          { icon: GraduationCap, label: 'Take Exams', href: '#take-exams' },
          { icon: BarChart3, label: 'Results', href: '#results' }
        ];
      default:
        return [];
    }
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'from-red-500 to-red-600',
      supervisor: 'from-purple-500 to-purple-600',
      proctor: 'from-blue-500 to-blue-600',
      teacher: 'from-green-500 to-green-600',
      student: 'from-orange-500 to-orange-600'
    };
    return colors[role as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="w-16 sm:w-64 bg-gray-900 text-white h-screen flex flex-col">
      {/* Logo and Title */}
      <div className="p-3 sm:p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3 justify-center sm:justify-start">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getRoleColor(user?.role || '')} flex items-center justify-center`}>
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold">ExamGlance</h1>
            <p className="text-sm text-gray-400 capitalize">{user?.role} Portal</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-2 sm:p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3 justify-center sm:justify-start">
          <img 
            src={user?.avatar || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=1'} 
            alt={user?.name}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
          />
          <div className="flex-1 min-w-0 hidden sm:block">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-2 sm:px-4 py-6 space-y-2">
        {getMenuItems().map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="flex items-center space-x-3 px-2 sm:px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors justify-center sm:justify-start"
            title={item.label}
          >
            <item.icon className="w-5 h-5" />
            <span className="hidden sm:inline">{item.label}</span>
          </a>
        ))}
      </nav>

      {/* Status Indicator */}
      <div className="p-2 sm:p-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400 hidden sm:inline">System Status</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-500 hidden sm:inline">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;