import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useExam } from '../../contexts/ExamContext';
import { Plus, Save, Eye, Settings, Users, Clock, FileText, Shield, Camera, Mic, Monitor } from 'lucide-react';

interface Question {
  id: string;
  type: 'multiple-choice' | 'short-answer' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  points: number;
}

const CreateExam: React.FC = () => {
  const { user } = useAuth();
  const { createExam } = useExam();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    duration: 60,
    totalQuestions: 0,
    startTime: '',
    endTime: '',
    subject: '',
    instructions: ''
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    type: 'multiple-choice',
    question: '',
    options: ['', '', '', ''],
    points: 1
  });

  const [settings, setSettings] = useState({
    allowedAttempts: 1,
    enableScreenShare: true,
    enableSecondaryCamera: true,
    enableAudioMonitoring: true,
    enableAIDetection: true,
    warningLimit: 3,
    browserLockdown: true,
    shuffleQuestions: false,
    showResults: true,
    allowReview: false,
    timeWarnings: [15, 5] // minutes before end
  });

  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedProctors, setSelectedProctors] = useState<string[]>([]);

  // Mock data for students and proctors
  const availableStudents = [
    { id: 's1', name: 'Alex Smith', email: 'alex@example.com' },
    { id: 's2', name: 'Emma Johnson', email: 'emma@example.com' },
    { id: 's3', name: 'Michael Brown', email: 'michael@example.com' },
    { id: 's4', name: 'Sarah Davis', email: 'sarah@example.com' },
    { id: 's5', name: 'James Wilson', email: 'james@example.com' }
  ];

  const availableProctors = [
    { id: 'p1', name: 'John Proctor', email: 'john@example.com' },
    { id: 'p2', name: 'Sarah Monitor', email: 'sarah.m@example.com' },
    { id: 'p3', name: 'Mike Wilson', email: 'mike@example.com' }
  ];

  const steps = [
    { id: 1, title: 'Basic Information', icon: FileText },
    { id: 2, title: 'Questions', icon: Plus },
    { id: 3, title: 'Security Settings', icon: Shield },
    { id: 4, title: 'Assign Participants', icon: Users },
    { id: 5, title: 'Review & Publish', icon: Eye }
  ];

  const addQuestion = () => {
    if (currentQuestion.question?.trim()) {
      const newQuestion: Question = {
        id: Date.now().toString(),
        type: currentQuestion.type || 'multiple-choice',
        question: currentQuestion.question,
        options: currentQuestion.options,
        correctAnswer: currentQuestion.correctAnswer,
        points: currentQuestion.points || 1
      };
      
      setQuestions([...questions, newQuestion]);
      setCurrentQuestion({
        type: 'multiple-choice',
        question: '',
        options: ['', '', '', ''],
        points: 1
      });
      setExamData(prev => ({ ...prev, totalQuestions: questions.length + 1 }));
    }
  };

  const removeQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
    setExamData(prev => ({ ...prev, totalQuestions: questions.length - 1 }));
  };

  const handleCreateExam = () => {
    const newExam = {
      ...examData,
      teacherId: user?.id || '',
      teacherName: user?.name || '',
      status: 'draft' as const,
      students: selectedStudents,
      proctors: selectedProctors,
      settings
    };

    createExam(newExam);
    alert('Exam created successfully!');
    
    // Reset form
    setCurrentStep(1);
    setExamData({
      title: '',
      description: '',
      duration: 60,
      totalQuestions: 0,
      startTime: '',
      endTime: '',
      subject: '',
      instructions: ''
    });
    setQuestions([]);
    setSelectedStudents([]);
    setSelectedProctors([]);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exam Title</label>
                <input
                  type="text"
                  value={examData.title}
                  onChange={(e) => setExamData({...examData, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter exam title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={examData.subject}
                  onChange={(e) => setExamData({...examData, subject: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Mathematics, Physics"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={examData.description}
                onChange={(e) => setExamData({...examData, description: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Describe the exam content and objectives"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={examData.duration}
                  onChange={(e) => setExamData({...examData, duration: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                <input
                  type="datetime-local"
                  value={examData.startTime}
                  onChange={(e) => setExamData({...examData, startTime: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                <input
                  type="datetime-local"
                  value={examData.endTime}
                  onChange={(e) => setExamData({...examData, endTime: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instructions for Students</label>
              <textarea
                value={examData.instructions}
                onChange={(e) => setExamData({...examData, instructions: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Provide detailed instructions for students taking this exam"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Question</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
                    <select
                      value={currentQuestion.type}
                      onChange={(e) => setCurrentQuestion({...currentQuestion, type: e.target.value as any})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="multiple-choice">Multiple Choice</option>
                      <option value="short-answer">Short Answer</option>
                      <option value="essay">Essay</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                    <input
                      type="number"
                      value={currentQuestion.points}
                      onChange={(e) => setCurrentQuestion({...currentQuestion, points: parseInt(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                  <textarea
                    value={currentQuestion.question}
                    onChange={(e) => setCurrentQuestion({...currentQuestion, question: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Enter your question here"
                  />
                </div>
                
                {currentQuestion.type === 'multiple-choice' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Answer Options</label>
                    <div className="space-y-2">
                      {currentQuestion.options?.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="correct-answer"
                            checked={currentQuestion.correctAnswer === index}
                            onChange={() => setCurrentQuestion({...currentQuestion, correctAnswer: index})}
                            className="text-blue-600"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...(currentQuestion.options || [])];
                              newOptions[index] = e.target.value;
                              setCurrentQuestion({...currentQuestion, options: newOptions});
                            }}
                            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={`Option ${index + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <button
                  onClick={addQuestion}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Question
                </button>
              </div>
            </div>
            
            {/* Questions List */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Questions ({questions.length})
              </h3>
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-gray-600">Q{index + 1}</span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {question.type.replace('-', ' ')}
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                            {question.points} pts
                          </span>
                        </div>
                        <p className="text-gray-900 mb-2">{question.question}</p>
                        {question.options && (
                          <div className="space-y-1">
                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className={`text-sm ${
                                question.correctAnswer === optIndex ? 'text-green-600 font-medium' : 'text-gray-600'
                              }`}>
                                {String.fromCharCode(65 + optIndex)}. {option}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeQuestion(question.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Monitoring Settings */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monitoring Settings</h3>
                <div className="space-y-4">
                  {[
                    { key: 'enableAIDetection', label: 'AI Malpractice Detection', icon: Shield },
                    { key: 'enableScreenShare', label: 'Screen Sharing Required', icon: Monitor },
                    { key: 'enableSecondaryCamera', label: 'Secondary Camera (Mobile)', icon: Camera },
                    { key: 'enableAudioMonitoring', label: 'Audio Monitoring', icon: Mic },
                    { key: 'browserLockdown', label: 'Browser Lockdown Mode', icon: Shield }
                  ].map((setting) => {
                    const Icon = setting.icon;
                    return (
                      <div key={setting.key} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5 text-gray-600" />
                          <span className="text-sm font-medium text-gray-900">{setting.label}</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings[setting.key as keyof typeof settings] as boolean}
                            onChange={(e) => setSettings({...settings, [setting.key]: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Exam Rules */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Exam Rules</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Allowed Attempts</label>
                    <input
                      type="number"
                      value={settings.allowedAttempts}
                      onChange={(e) => setSettings({...settings, allowedAttempts: parseInt(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Warning Limit</label>
                    <input
                      type="number"
                      value={settings.warningLimit}
                      onChange={(e) => setSettings({...settings, warningLimit: parseInt(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      max="5"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    {[
                      { key: 'shuffleQuestions', label: 'Shuffle Questions' },
                      { key: 'showResults', label: 'Show Results After Submission' },
                      { key: 'allowReview', label: 'Allow Answer Review' }
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{setting.label}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings[setting.key as keyof typeof settings] as boolean}
                            onChange={(e) => setSettings({...settings, [setting.key]: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Students */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign Students</h3>
                <div className="space-y-3">
                  {availableStudents.map((student) => (
                    <div key={student.id} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStudents([...selectedStudents, student.id]);
                          } else {
                            setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  {selectedStudents.length} students selected
                </div>
              </div>

              {/* Proctors */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign Proctors</h3>
                <div className="space-y-3">
                  {availableProctors.map((proctor) => (
                    <div key={proctor.id} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedProctors.includes(proctor.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProctors([...selectedProctors, proctor.id]);
                          } else {
                            setSelectedProctors(selectedProctors.filter(id => id !== proctor.id));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{proctor.name}</p>
                        <p className="text-sm text-gray-600">{proctor.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  {selectedProctors.length} proctors selected
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Exam Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Title:</span> {examData.title}</div>
                    <div><span className="text-gray-600">Subject:</span> {examData.subject}</div>
                    <div><span className="text-gray-600">Duration:</span> {examData.duration} minutes</div>
                    <div><span className="text-gray-600">Questions:</span> {questions.length}</div>
                    <div><span className="text-gray-600">Total Points:</span> {questions.reduce((sum, q) => sum + q.points, 0)}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Participants</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Students:</span> {selectedStudents.length}</div>
                    <div><span className="text-gray-600">Proctors:</span> {selectedProctors.length}</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-2">Security Settings</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(settings).filter(([_, value]) => typeof value === 'boolean' && value).map(([key, _]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Exam</h1>
            <p className="text-gray-600 mt-2">Design and configure a comprehensive examination</p>
          </div>
          <div className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">Step {currentStep} of {steps.length}</span>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  isActive ? 'bg-blue-600 text-white' :
                  isCompleted ? 'bg-green-600 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    isActive ? 'text-blue-600' :
                    isCompleted ? 'text-green-600' :
                    'text-gray-600'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 ${
                    isCompleted ? 'bg-green-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex items-center space-x-3">
            <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              <Save className="w-4 h-4 inline mr-2" />
              Save Draft
            </button>
            
            {currentStep < steps.length ? (
              <button
                onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleCreateExam}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create Exam
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateExam;