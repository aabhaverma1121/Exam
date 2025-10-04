export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'supervisor' | 'proctor' | 'teacher' | 'student';
  avatar?: string;
  createdAt: string;
  isActive: boolean;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  teacherName: string;
  duration: number; // in minutes
  totalQuestions: number;
  startTime: string;
  endTime: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed';
  students: string[];
  proctors: string[];
  settings: ExamSettings;
  createdAt: string;
}

export interface ExamSettings {
  allowedAttempts: number;
  enableScreenShare: boolean;
  enableSecondaryCamera: boolean;
  enableAudioMonitoring: boolean;
  enableAIDetection: boolean;
  warningLimit: number;
  browserLockdown: boolean;
}

export interface Question {
  id: string;
  examId: string;
  type: 'multiple-choice' | 'short-answer' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  points: number;
  order: number;
}

export interface ExamSession {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  proctorId: string;
  status: 'setup' | 'active' | 'warning' | 'completed' | 'terminated';
  warnings: Warning[];
  incidents: Incident[];
  startTime: string;
  endTime?: string;
  isLive: boolean;
  cameras: {
    primary: boolean;
    secondary: boolean;
    screen: boolean;
  };
}

export interface Warning {
  id: string;
  type: 'voice-detection' | 'multiple-persons' | 'prohibited-object' | 'eye-movement' | 'posture' | 'tab-switch';
  message: string;
  timestamp: string;
  aiConfidence: number;
}

export interface Incident {
  id: string;
  sessionId: string;
  proctorId: string;
  type: 'suspicious-activity' | 'technical-issue' | 'malpractice' | 'emergency';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  evidence?: string[];
  status: 'open' | 'investigating' | 'resolved' | 'escalated';
  isRedFlag: boolean;
}

export interface Result {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  score: number;
  totalPoints: number;
  percentage: number;
  answers: Answer[];
  submittedAt: string;
  gradedAt?: string;
  feedback?: string;
  status: 'submitted' | 'grading' | 'graded' | 'published';
}

export interface Answer {
  questionId: string;
  answer: string | number;
  isCorrect?: boolean;
  points: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  message: string;
  timestamp: string;
  type: 'supervisor-proctor' | 'supervisor-student' | 'emergency';
}

export interface AIDetection {
  type: 'voice' | 'person' | 'object' | 'eye' | 'posture';
  confidence: number;
  description: string;
  timestamp: string;
  sessionId: string;
}