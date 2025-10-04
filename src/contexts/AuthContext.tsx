import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User }>;
  signup: (email: string, password: string, name: string, role: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@examglance.com',
    name: 'System Administrator',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    createdAt: '2024-01-01T00:00:00Z',
    isActive: true
  },
  {
    id: '2',
    email: 'supervisor@examglance.com',
    name: 'Exam Supervisor',
    role: 'supervisor',
    avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    createdAt: '2024-01-01T00:00:00Z',
    isActive: true
  },
  {
    id: '3',
    email: 'proctor@examglance.com',
    name: 'John Proctor',
    role: 'proctor',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    createdAt: '2024-01-01T00:00:00Z',
    isActive: true
  },
  {
    id: '4',
    email: 'teacher@examglance.com',
    name: 'Dr. Sarah Johnson',
    role: 'teacher',
    avatar: 'https://images.pexels.com/photos/1181391/pexels-photo-1181391.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    createdAt: '2024-01-01T00:00:00Z',
    isActive: true
  },
  {
    id: '5',
    email: 'student@examglance.com',
    name: 'Alex Smith',
    role: 'student',
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    createdAt: '2024-01-01T00:00:00Z',
    isActive: true
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and check for stored user
    const storedUser = localStorage.getItem('examglance_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; user?: User }> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === 'password123') {
      // For non-proctors, set user immediately
      if (foundUser.role !== 'proctor') {
        setUser(foundUser);
        localStorage.setItem('examglance_user', JSON.stringify(foundUser));
      }
      // For proctors, return user data but don't set in context yet
      setIsLoading(false);
      return { success: true, user: foundUser };
    }
    
    setIsLoading(false);
    return { success: false };
  };

  const signup = async (email: string, password: string, name: string, role: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      setIsLoading(false);
      return { success: false, error: 'Email already exists' };
    }

    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      email,
      name,
      role: role as 'admin' | 'supervisor' | 'proctor' | 'teacher' | 'student',
      avatar: `https://images.pexels.com/photos/1181${Math.floor(Math.random() * 900) + 100}/pexels-photo-1181${Math.floor(Math.random() * 900) + 100}.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1`,
      createdAt: new Date().toISOString(),
      isActive: true
    };

    mockUsers.push(newUser);

    if (newUser.role !== 'proctor') {
      setUser(newUser);
      localStorage.setItem('examglance_user', JSON.stringify(newUser));
    }

    setIsLoading(false);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('examglance_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};