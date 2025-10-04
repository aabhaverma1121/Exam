import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ExamProvider } from './contexts/ExamContext';
import { RealtimeProvider } from './contexts/RealtimeContext';
import LoginForm from './components/auth/LoginForm';
import Layout from './components/layout/Layout';
import AdminDashboard from './components/dashboards/AdminDashboard';
import SupervisorDashboard from './components/dashboards/SupervisorDashboard';
import ProctorDashboard from './components/dashboards/ProctorDashboard';
import TeacherDashboard from './components/dashboards/TeacherDashboard';
import StudentDashboard from './components/dashboards/StudentDashboard';
import StudentMyExams from './components/student/MyExams';
import TakeExams from './components/student/TakeExams';
import StudentResults from './components/student/Results';
import ExamInterface from './components/student/ExamInterface';

// Admin Components
import UserManagement from './components/admin/UserManagement';
import ExamManagement from './components/admin/ExamManagement';
import ResultsAnalytics from './components/admin/ResultsAnalytics';
import IncidentReports from './components/admin/IncidentReports';
import SystemSettings from './components/admin/SystemSettings';

// Supervisor Components
import VideoFeeds from './components/supervisor/VideoFeeds';
import Communications from './components/supervisor/Communications';
import SupervisorIncidents from './components/supervisor/Incidents';
import Reports from './components/supervisor/Reports';

// Proctor Components
import CameraFeeds from './components/proctor/CameraFeeds';
import ReportIncident from './components/proctor/ReportIncident';
import SupervisorChat from './components/proctor/SupervisorChat';

// Teacher Components
import MyExams from './components/teacher/MyExams';
import CreateExam from './components/teacher/CreateExam';
import Results from './components/teacher/Results';
import TeacherIncidents from './components/teacher/Incidents';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = React.useState('dashboard');

  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      setCurrentPage(hash || 'dashboard');
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Set initial page

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const getDashboard = () => {
    if (user.role === 'admin') {
      switch (currentPage) {
        case 'user-management':
          return <UserManagement />;
        case 'exam-management':
          return <ExamManagement />;
        case 'results-analytics':
          return <ResultsAnalytics />;
        case 'incident-reports':
          return <IncidentReports />;
        case 'system-settings':
          return <SystemSettings />;
        default:
          return <AdminDashboard />;
      }
    }

    if (user.role === 'supervisor') {
      switch (currentPage) {
        case 'video-feeds':
          return <VideoFeeds />;
        case 'communications':
          return <Communications />;
        case 'incidents':
          return <SupervisorIncidents />;
        case 'reports':
          return <Reports />;
        default:
          return <SupervisorDashboard />;
      }
    }

    if (user.role === 'proctor') {
      switch (currentPage) {
        case 'camera-feeds':
          return <CameraFeeds />;
        case 'report-incident':
          return <ReportIncident />;
        case 'supervisor-chat':
          return <SupervisorChat />;
        default:
          return <ProctorDashboard />;
      }
    }

    if (user.role === 'teacher') {
      switch (currentPage) {
        case 'my-exams':
          return <MyExams />;
        case 'create-exam':
          return <CreateExam />;
        case 'results':
          return <Results />;
        case 'incidents':
          return <TeacherIncidents />;
        default:
          return <TeacherDashboard />;
      }
    }

    switch (user.role) {
      case 'student':
        switch (currentPage) {
          case 'my-exams':
            return <StudentMyExams />;
          case 'take-exams':
            return <TakeExams />;
          case 'results':
            return <StudentResults />;
          default:
            return <StudentDashboard />;
        }
      default:
        return <div>Invalid role</div>;
    }
  };

  return (
    <Layout>
      {getDashboard()}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <RealtimeProvider>
        <ExamProvider>
          <AppContent />
        </ExamProvider>
      </RealtimeProvider>
    </AuthProvider>
  );
}

export default App;