import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useExam } from '../../contexts/ExamContext';
import { Clock, AlertTriangle, Camera, Mic, Monitor, Flag, Send, Eye, EyeOff } from 'lucide-react';

interface Question {
  id: string;
  type: 'multiple-choice' | 'short-answer' | 'essay';
  question: string;
  options?: string[];
  points: number;
  order: number;
}

interface ExamInterfaceProps {
  examId: string;
  onExitExam: () => void;
}

const ExamInterface: React.FC<ExamInterfaceProps> = ({ examId, onExitExam }) => {
  const { user } = useAuth();
  const { exams } = useExam();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningCount, setWarningCount] = useState(0);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{id: string, sender: string, message: string, timestamp: Date}>>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const examContainerRef = useRef<HTMLDivElement>(null);

  const exam = exams.find(e => e.id === examId);
  
  // Mock questions for the exam
  const questions: Question[] = [
    {
      id: 'q1',
      type: 'multiple-choice',
      question: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      points: 10,
      order: 1
    },
    {
      id: 'q2',
      type: 'multiple-choice',
      question: 'Which planet is closest to the sun?',
      options: ['Venus', 'Mercury', 'Earth', 'Mars'],
      points: 10,
      order: 2
    },
    {
      id: 'q3',
      type: 'short-answer',
      question: 'Explain the process of photosynthesis in plants.',
      points: 20,
      order: 3
    },
    {
      id: 'q4',
      type: 'essay',
      question: 'Discuss the impact of climate change on global ecosystems.',
      points: 30,
      order: 4
    }
  ];

  useEffect(() => {
    if (exam) {
      setTimeRemaining(exam.duration * 60); // Convert minutes to seconds
    }
  }, [exam]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      
      // Detect if user exited fullscreen
      if (!document.fullscreenElement && isFullscreen) {
        setWarningCount(prev => prev + 1);
        setShowWarning(true);
        
        if (warningCount >= 2) {
          alert('Exam terminated due to multiple security violations!');
          onExitExam();
          return;
        }
        
        // Force back to fullscreen
        setTimeout(() => {
          enterFullscreen();
        }, 1000);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent common shortcuts that could be used to cheat
      if (
        e.key === 'F12' || 
        (e.ctrlKey && (e.key === 'u' || e.key === 'i' || e.key === 'j')) ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        e.altKey && e.key === 'Tab'
      ) {
        e.preventDefault();
        setWarningCount(prev => prev + 1);
        setShowWarning(true);
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isFullscreen, warningCount, onExitExam]);

  const enterFullscreen = async () => {
    if (examContainerRef.current && !document.fullscreenElement) {
      try {
        await examContainerRef.current.requestFullscreen();
      } catch (error) {
        console.error('Error entering fullscreen:', error);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, answer: string | number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitExam = async () => {
    setIsSubmitting(true);
    
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Exit fullscreen
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
    
    alert('Exam submitted successfully!');
    onExitExam();
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        sender: 'You',
        message: chatMessage,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, newMessage]);
      setChatMessage('');
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (!exam) {
    return <div>Exam not found</div>;
  }

  return (
    <div 
      ref={examContainerRef}
      className="min-h-screen bg-gray-100 flex flex-col"
      style={{ minHeight: '100vh' }}
    >
      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <h2 className="text-xl font-bold text-red-900">Security Warning</h2>
            </div>
            <p className="text-gray-700 mb-4">
              You have violated exam security protocols. Warning {warningCount}/3.
              {warningCount >= 2 && ' Next violation will terminate your exam!'}
            </p>
            <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
              <p className="text-sm text-red-800">
                • Do not exit fullscreen mode<br/>
                • Do not use keyboard shortcuts<br/>
                • Do not right-click or open developer tools<br/>
                • Keep your camera visible at all times
              </p>
            </div>
            <button
              onClick={() => {
                setShowWarning(false);
                enterFullscreen();
              }}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              I Understand - Continue Exam
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">{exam.title}</h1>
            <div className="flex items-center space-x-2 px-3 py-1 bg-red-100 text-red-800 rounded-full">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">LIVE EXAM</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Timer */}
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <span className={`text-lg font-mono font-bold ${
                timeRemaining < 300 ? 'text-red-600' : 'text-gray-900'
              }`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            
            {/* Warning Count */}
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium text-gray-900">
                Warnings: {warningCount}/3
              </span>
            </div>
            
            {/* Camera Status */}
            <div className="flex items-center space-x-2">
              <Camera className="w-5 h-5 text-green-600" />
              <Mic className="w-5 h-5 text-green-600" />
              <Monitor className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Exam Area */}
        <div className="flex-1 p-6">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-sm text-gray-600">{progress.toFixed(0)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Question {currentQuestionIndex + 1}
                </h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {currentQuestion.points} points
                </span>
              </div>
              <p className="text-gray-800 text-lg leading-relaxed">
                {currentQuestion.question}
              </p>
            </div>

            {/* Answer Options */}
            <div className="space-y-4">
              {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <label key={index} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={index}
                        checked={answers[currentQuestion.id] === index}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, parseInt(e.target.value))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-900">{String.fromCharCode(65 + index)}. {option}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'short-answer' && (
                <textarea
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  placeholder="Enter your answer here..."
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              )}

              {currentQuestion.type === 'essay' && (
                <textarea
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  placeholder="Write your essay here..."
                  className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex items-center space-x-4">
              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmitExam}
                  disabled={isSubmitting}
                  className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Exam'}
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 p-4 space-y-4">
          {/* Question Navigator */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Question Navigator</h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-10 h-10 rounded text-sm font-medium ${
                    index === currentQuestionIndex
                      ? 'bg-blue-600 text-white'
                      : answers[questions[index].id] !== undefined
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="mt-3 text-xs text-gray-600">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-600 rounded"></div>
                  <span>Current</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gray-200 rounded"></div>
                  <span>Not answered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Proctor Chat */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Proctor Communication</h3>
            <div className="h-32 border rounded p-2 mb-3 overflow-y-auto bg-white">
              {chatMessages.length === 0 ? (
                <div className="text-sm text-gray-500 text-center">No messages</div>
              ) : (
                chatMessages.map((msg) => (
                  <div key={msg.id} className="mb-2 p-2 bg-gray-100 rounded text-sm">
                    <div className="font-medium text-gray-900">{msg.sender}</div>
                    <div className="text-gray-700">{msg.message}</div>
                    <div className="text-xs text-gray-500">{msg.timestamp.toLocaleTimeString()}</div>
                  </div>
                ))
              )}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Message proctor..."
                className="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Exam Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Exam Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{exam.duration} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Questions:</span>
                <span className="font-medium">{questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Points:</span>
                <span className="font-medium">{questions.reduce((sum, q) => sum + q.points, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Answered:</span>
                <span className="font-medium">
                  {Object.keys(answers).length}/{questions.length}
                </span>
              </div>
            </div>
          </div>

          {/* Security Status */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-900 mb-3">Security Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Camera Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Audio Monitoring</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Screen Recording</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isFullscreen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-gray-700">Fullscreen Mode</span>
              </div>
            </div>
            {warningCount > 0 && (
              <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    {warningCount} warning(s) issued
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamInterface;