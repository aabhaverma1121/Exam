import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useExam } from '../../contexts/ExamContext';
import { FileText, Clock, Trophy, AlertTriangle, Play, Camera, Mic, Monitor, Smartphone, CheckCircle } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getExamsByStudent, startExamSession } = useExam();
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [setupStep, setSetupStep] = useState(0);
  const [permissions, setPermissions] = useState({
    camera: false,
    microphone: false,
    screen: false,
    location: false,
    secondaryCamera: false
  });

  const studentExams = getExamsByStudent(user?.id || '');

  const setupSteps = [
    {
      title: 'Camera Permission',
      description: 'Allow access to your primary camera for monitoring',
      icon: Camera,
      permission: 'camera'
    },
    {
      title: 'Microphone Permission',
      description: 'Allow access to your microphone for audio monitoring',
      icon: Mic,
      permission: 'microphone'
    },
    {
      title: 'Screen Sharing',
      description: 'Allow screen sharing to monitor your exam interface',
      icon: Monitor,
      permission: 'screen'
    },
    {
      title: 'Secondary Camera Setup',
      description: 'Set up your mobile device as a secondary camera',
      icon: Smartphone,
      permission: 'secondaryCamera'
    }
  ];

  const handlePermissionGrant = (permission: string) => {
    setPermissions(prev => ({ ...prev, [permission]: true }));
    if (setupStep < setupSteps.length - 1) {
      setSetupStep(setupStep + 1);
    }
  };

  const handleStartExam = (examId: string) => {
    setSelectedExam(examId);
    setSetupStep(0);
    setPermissions({
      camera: false,
      microphone: false,
      screen: false,
      location: false,
      secondaryCamera: false
    });
  };

  const stats = [
    {
      title: 'Assigned Exams',
      value: studentExams.length.toString(),
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      title: 'Completed',
      value: studentExams.filter(e => e.status === 'completed').length.toString(),
      icon: Trophy,
      color: 'bg-green-500'
    },
    {
      title: 'Upcoming',
      value: studentExams.filter(e => e.status === 'scheduled').length.toString(),
      icon: Clock,
      color: 'bg-orange-500'
    },
    {
      title: 'Warnings Received',
      value: '0',
      icon: AlertTriangle,
      color: 'bg-red-500'
    }
  ];

  if (selectedExam) {
    const exam = studentExams.find(e => e.id === selectedExam);
    const currentStep = setupSteps[setupStep];
    const allPermissionsGranted = Object.values(permissions).every(p => p);

    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Exam Setup</h1>
            <p className="text-gray-600 mt-2">{exam?.title}</p>
          </div>

          {!allPermissionsGranted ? (
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((setupStep + 1) / setupSteps.length) * 100}%` }}
                ></div>
              </div>

              {/* Current Step */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <currentStep.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{currentStep.title}</h2>
                <p className="text-gray-600 mt-2">{currentStep.description}</p>
              </div>

              {/* Permission Action */}
              <div className="space-y-4">
                {currentStep.permission === 'secondaryCamera' ? (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <div className="text-6xl font-mono">📱</div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Scan this QR code with your mobile device to set up the secondary camera
                      </p>
                      <button
                        onClick={() => handlePermissionGrant('secondaryCamera')}
                        className="w-full bg-blue-600 text-white rounded-lg py-3 hover:bg-blue-700"
                      >
                        Mobile Camera Connected
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handlePermissionGrant(currentStep.permission)}
                    className="w-full bg-blue-600 text-white rounded-lg py-3 hover:bg-blue-700"
                  >
                    Grant Permission
                  </button>
                )}
              </div>

              {/* Step Indicators */}
              <div className="flex justify-center space-x-2">
                {setupSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index <= setupStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900">Setup Complete</h2>
                <p className="text-gray-600 mt-2">All permissions granted. You're ready to start the exam.</p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-900">Important Security Notice</h3>
                    <p className="text-sm text-red-700 mt-1">
                      Once you start the exam, your browser will be locked in full-screen mode. 
                      Any attempt to exit, minimize, or switch tabs will be detected and may result in warnings or exam termination.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  startExamSession(selectedExam, user?.id || '', '3');
                  // In a real app, this would redirect to the locked exam interface
                  alert('Exam started! Browser would now be locked in full-screen mode.');
                }}
                className="w-full bg-green-600 text-white rounded-lg py-3 hover:bg-green-700 font-medium"
              >
                Start Exam
              </button>

              <button
                onClick={() => setSelectedExam(null)}
                className="w-full border border-gray-300 text-gray-700 rounded-lg py-3 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="text-gray-600 mt-2">View your assigned exams and track your progress</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{studentExams.length}</p>
            <p className="text-sm text-gray-600">Total Exams</p>
          </div>
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

      {/* Assigned Exams */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">My Exams</h2>
        
        <div className="space-y-4">
          {studentExams.map((exam) => (
            <div key={exam.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-gray-900">{exam.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      exam.status === 'active' ? 'bg-green-100 text-green-800' :
                      exam.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      exam.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {exam.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">{exam.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{exam.duration} minutes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FileText className="w-4 h-4" />
                      <span>{exam.totalQuestions} questions</span>
                    </div>
                    <span>By {exam.teacherName}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Starts: {new Date(exam.startTime).toLocaleString()}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  {exam.status === 'active' && (
                    <button
                      onClick={() => handleStartExam(exam.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Play className="w-4 h-4" />
                      <span>Take Exam</span>
                    </button>
                  )}
                  {exam.status === 'scheduled' && (
                    <div className="text-blue-600 font-medium">Upcoming</div>
                  )}
                  {exam.status === 'completed' && (
                    <div className="text-gray-600 font-medium">Completed</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">Exam Security Guidelines</h3>
            <ul className="text-sm text-blue-700 mt-2 space-y-1">
              <li>• Ensure you're in a quiet, well-lit room</li>
              <li>• Have a valid ID ready for verification</li>
              <li>• Clear your desk of all materials except allowed items</li>
              <li>• Ensure stable internet connection</li>
              <li>• Keep your face visible to the camera at all times</li>
              <li>• Do not leave your seat during the exam</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;