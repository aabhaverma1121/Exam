import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Exam, ExamSession, Warning, Incident, Result, Question } from '../types';

interface ExamContextType {
  exams: Exam[];
  sessions: ExamSession[];
  results: Result[];
  questions: Question[];
  createExam: (exam: Omit<Exam, 'id' | 'createdAt'>) => void;
  updateExam: (id: string, updates: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  startExamSession: (examId: string, studentId: string, proctorId: string) => string;
  addWarning: (sessionId: string, warning: Omit<Warning, 'id'>) => void;
  addIncident: (sessionId: string, incident: Omit<Incident, 'id' | 'sessionId'>) => void;
  updateSessionStatus: (sessionId: string, status: ExamSession['status']) => void;
  getActiveExams: () => Exam[];
  getExamsByTeacher: (teacherId: string) => Exam[];
  getExamsByStudent: (studentId: string) => Exam[];
  getSessionsByProctor: (proctorId: string) => ExamSession[];
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

const mockQuestions: Question[] = [
  {
    id: 'q1',
    examId: 'e1',
    type: 'multiple-choice',
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 2,
    points: 10,
    order: 1
  },
  {
    id: 'q2',
    examId: 'e1',
    type: 'multiple-choice',
    question: 'Which planet is closest to the sun?',
    options: ['Venus', 'Mercury', 'Earth', 'Mars'],
    correctAnswer: 1,
    points: 10,
    order: 2
  },
  {
    id: 'q3',
    examId: 'e1',
    type: 'short-answer',
    question: 'Explain the concept of photosynthesis in plants.',
    points: 20,
    order: 3
  }
];

const mockExams: Exam[] = [
  {
    id: 'e1',
    title: 'General Knowledge Test',
    description: 'A comprehensive test covering various topics including geography, science, and current affairs.',
    teacherId: '4',
    teacherName: 'Dr. Sarah Johnson',
    duration: 60,
    totalQuestions: 25,
    startTime: '2024-12-19T10:00:00Z',
    endTime: '2024-12-19T11:00:00Z',
    status: 'active',
    students: ['5'],
    proctors: ['3'],
    settings: {
      allowedAttempts: 1,
      enableScreenShare: true,
      enableSecondaryCamera: true,
      enableAudioMonitoring: true,
      enableAIDetection: true,
      warningLimit: 3,
      browserLockdown: true
    },
    createdAt: '2024-12-18T00:00:00Z'
  },
  {
    id: 'e2',
    title: 'Mathematics Final Exam',
    description: 'Comprehensive mathematics examination covering algebra, geometry, and calculus.',
    teacherId: '4',
    teacherName: 'Dr. Sarah Johnson',
    duration: 120,
    totalQuestions: 50,
    startTime: '2024-12-20T14:00:00Z',
    endTime: '2024-12-20T16:00:00Z',
    status: 'scheduled',
    students: ['5'],
    proctors: ['3'],
    settings: {
      allowedAttempts: 1,
      enableScreenShare: true,
      enableSecondaryCamera: true,
      enableAudioMonitoring: true,
      enableAIDetection: true,
      warningLimit: 3,
      browserLockdown: true
    },
    createdAt: '2024-12-18T00:00:00Z'
  }
];

const mockSessions: ExamSession[] = [
  {
    id: 's1',
    examId: 'e1',
    studentId: '5',
    studentName: 'Alex Smith',
    proctorId: '3',
    status: 'active',
    warnings: [],
    incidents: [],
    startTime: '2024-12-19T10:00:00Z',
    isLive: true,
    cameras: {
      primary: true,
      secondary: true,
      screen: true
    }
  }
];

export const ExamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [exams, setExams] = useState<Exam[]>(mockExams);
  const [sessions, setSessions] = useState<ExamSession[]>(mockSessions);
  const [results, setResults] = useState<Result[]>([]);
  const [questions] = useState<Question[]>(mockQuestions);

  const createExam = (examData: Omit<Exam, 'id' | 'createdAt'>) => {
    const newExam: Exam = {
      ...examData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setExams(prev => [...prev, newExam]);
  };

  const updateExam = (id: string, updates: Partial<Exam>) => {
    setExams(prev => prev.map(exam => 
      exam.id === id ? { ...exam, ...updates } : exam
    ));
  };

  const deleteExam = (id: string) => {
    setExams(prev => prev.filter(exam => exam.id !== id));
  };

  const startExamSession = (examId: string, studentId: string, proctorId: string): string => {
    const exam = exams.find(e => e.id === examId);
    const sessionId = Date.now().toString();
    
    const newSession: ExamSession = {
      id: sessionId,
      examId,
      studentId,
      studentName: 'Student Name', // In real app, fetch from user data
      proctorId,
      status: 'setup',
      warnings: [],
      incidents: [],
      startTime: new Date().toISOString(),
      isLive: true,
      cameras: {
        primary: false,
        secondary: false,
        screen: false
      }
    };
    
    setSessions(prev => [...prev, newSession]);
    return sessionId;
  };

  const addWarning = (sessionId: string, warning: Omit<Warning, 'id'>) => {
    const newWarning: Warning = {
      ...warning,
      id: Date.now().toString()
    };
    
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        const updatedWarnings = [...session.warnings, newWarning];
        return {
          ...session,
          warnings: updatedWarnings,
          status: updatedWarnings.length >= 3 ? 'terminated' : 'warning'
        };
      }
      return session;
    }));
  };

  const addIncident = (sessionId: string, incident: Omit<Incident, 'id' | 'sessionId'>) => {
    const newIncident: Incident = {
      ...incident,
      id: Date.now().toString(),
      sessionId
    };
    
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, incidents: [...session.incidents, newIncident] }
        : session
    ));
  };

  const updateSessionStatus = (sessionId: string, status: ExamSession['status']) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId ? { ...session, status } : session
    ));
  };

  const getActiveExams = () => exams.filter(exam => exam.status === 'active');
  
  const getExamsByTeacher = (teacherId: string) => 
    exams.filter(exam => exam.teacherId === teacherId);
  
  const getExamsByStudent = (studentId: string) => 
    exams.filter(exam => exam.students.includes(studentId));
  
  const getSessionsByProctor = (proctorId: string) => 
    sessions.filter(session => session.proctorId === proctorId);

  return (
    <ExamContext.Provider value={{
      exams,
      sessions,
      results,
      questions,
      createExam,
      updateExam,
      deleteExam,
      startExamSession,
      addWarning,
      addIncident,
      updateSessionStatus,
      getActiveExams,
      getExamsByTeacher,
      getExamsByStudent,
      getSessionsByProctor
    }}>
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (context === undefined) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
};