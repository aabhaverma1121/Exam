import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useExam } from '../../contexts/ExamContext';
import ExamInterface from './ExamInterface';
import { Play, Clock, FileText, AlertTriangle, Camera, Mic, Monitor, Smartphone, CheckCircle } from 'lucide-react';

const TakeExams: React.FC = () => {
  const { user } = useAuth();
  const { getExamsByStudent, startExamSession } = useExam();
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [setupStep, setSetupStep] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [permissions, setPermissions] = useState({
    camera: false,
    microphone: false,
    screen: false,
    secondaryCamera: false
  });

  const studentExams = getExamsByStudent(user?.id || '').filter(exam => exam.status === 'active');

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
      secondaryCamera: false
    });
  };

  const handleBeginExam = () => {
    if (selectedExam) {
      startExamSession(selectedExam, user?.id || '', '3');
      setExamStarted(true);
    }
  };

  const handleExitExam = () => {
    setExamStarted(false);
    setSelectedExam(null);
    setSetupStep(0);
    setPermissions({
      camera: false,
      microphone: false,
      screen: false,
      secondaryCamera: false
    });
  };

  // If exam is started, show the exam interface
  if (examStarted && selectedExam) {
    return <ExamInterface examId={selectedExam} onExitExam={handleExitExam} />;
  }

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
                        <div className="text-6xl">📱</div>
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
                onClick={handleBeginExam}
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
            <h1 className="text-2xl font-bold text-gray-900">Take Exams</h1>
            <p className="text-gray-600 mt-2">Start your active examinations</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">{studentExams.length}</p>
            <p className="text-sm text-gray-600">Active Exams</p>
          </div>
        </div>
      </div>

      {/* Active Exams */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Exams</h2>
        
        {studentExams.length > 0 ? (
          <div className="space-y-4">
            {studentExams.map((exam) => (
              <div key={exam.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <Play className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-gray-900">{exam.title}</h3>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        ACTIVE
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{exam.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{exam.duration} minutes</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span>{exam.totalQuestions} questions</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{exam.settings.warningLimit} warning limit</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <p><span className="font-medium">Instructor:</span> {exam.teacherName}</p>
                      <p><span className="font-medium">End Time:</span> {new Date(exam.endTime).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="ml-6">
                    <button
                      onClick={() => handleStartExam(exam.id)}
                      className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                    >
                      <Play className="w-4 h-4" />
                      <span>Start Exam</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Exams</h3>
            <p className="text-gray-600">
              You don't have any active exams to take at the moment.
            </p>
          </div>
        )}
      </div>

      {/* Security Guidelines */}
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

export default TakeExams;