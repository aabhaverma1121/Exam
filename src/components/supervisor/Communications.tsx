import React, { useState } from 'react';
import EnhancedChat from '../shared/EnhancedChat';
import { MessageSquare, Send, Users, Clock, AlertTriangle, Phone, Video } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'supervisor' | 'proctor' | 'student';
  receiverId: string;
  message: string;
  timestamp: string;
  type: 'text' | 'alert' | 'emergency';
  isRead: boolean;
}

interface ChatChannel {
  id: string;
  name: string;
  type: 'proctor' | 'student' | 'emergency';
  participants: number;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'online' | 'busy' | 'offline';
}

const Communications: React.FC = () => {
  const [activeChannel, setActiveChannel] = useState<string>('proctor-main');
  const [newMessage, setNewMessage] = useState('');
  const [messageType, setMessageType] = useState<'text' | 'alert' | 'emergency'>('text');

  // Enhanced chat participants
  const [chatParticipants] = useState([
    { id: 'p1', name: 'John Proctor', role: 'proctor' as const, status: 'online' as const },
    { id: 'p2', name: 'Sarah Monitor', role: 'proctor' as const, status: 'busy' as const },
    { id: 'p3', name: 'Mike Wilson', role: 'proctor' as const, status: 'online' as const },
    { id: 's1', name: 'Alex Smith', role: 'student' as const, status: 'online' as const },
    { id: 's2', name: 'Emma Johnson', role: 'student' as const, status: 'online' as const },
    { id: 's3', name: 'Michael Brown', role: 'student' as const, status: 'online' as const },
    { id: 's4', name: 'Sarah Davis', role: 'student' as const, status: 'online' as const }
  ]);

  const [enhancedChatMessages, setEnhancedChatMessages] = useState<any[]>([]);

  const [channels] = useState<ChatChannel[]>([
    {
      id: 'proctor-main',
      name: 'All Proctors',
      type: 'proctor',
      participants: 5,
      lastMessage: 'Please monitor Student #3 closely',
      lastMessageTime: '2 min ago',
      unreadCount: 0,
      status: 'online'
    },
    {
      id: 'proctor-john',
      name: 'John Proctor',
      type: 'proctor',
      participants: 1,
      lastMessage: 'Incident reported for Alex Smith',
      lastMessageTime: '5 min ago',
      unreadCount: 2,
      status: 'online'
    },
    {
      id: 'proctor-sarah',
      name: 'Sarah Monitor',
      type: 'proctor',
      participants: 1,
      lastMessage: 'All students behaving normally',
      lastMessageTime: '10 min ago',
      unreadCount: 0,
      status: 'busy'
    },
    {
      id: 'student-alex',
      name: 'Alex Smith',
      type: 'student',
      participants: 1,
      lastMessage: 'Technical issue with camera',
      lastMessageTime: '15 min ago',
      unreadCount: 1,
      status: 'online'
    },
    {
      id: 'emergency',
      name: 'Emergency Channel',
      type: 'emergency',
      participants: 8,
      lastMessage: 'No active emergencies',
      lastMessageTime: '1 hour ago',
      unreadCount: 0,
      status: 'online'
    }
  ]);

  const [messages] = useState<Message[]>([
    {
      id: '1',
      senderId: 'supervisor1',
      senderName: 'You',
      senderRole: 'supervisor',
      receiverId: 'proctor-main',
      message: 'Good morning everyone. Please ensure all camera feeds are active and students have completed their setup.',
      timestamp: '2024-12-19T09:00:00Z',
      type: 'text',
      isRead: true
    },
    {
      id: '2',
      senderId: 'proctor1',
      senderName: 'John Proctor',
      senderRole: 'proctor',
      receiverId: 'proctor-main',
      message: 'All my assigned students are ready. Cameras and screen sharing active.',
      timestamp: '2024-12-19T09:02:00Z',
      type: 'text',
      isRead: true
    },
    {
      id: '3',
      senderId: 'proctor2',
      senderName: 'Sarah Monitor',
      senderRole: 'proctor',
      receiverId: 'proctor-main',
      message: 'Student Emma Johnson having minor technical difficulties with secondary camera. Resolving now.',
      timestamp: '2024-12-19T09:05:00Z',
      type: 'alert',
      isRead: true
    },
    {
      id: '4',
      senderId: 'supervisor1',
      senderName: 'You',
      senderRole: 'supervisor',
      receiverId: 'proctor-main',
      message: 'Please monitor Student #3 closely. There have been some concerns raised.',
      timestamp: '2024-12-19T09:08:00Z',
      type: 'alert',
      isRead: true
    },
    {
      id: '5',
      senderId: 'proctor1',
      senderName: 'John Proctor',
      senderRole: 'proctor',
      receiverId: 'proctor-main',
      message: 'Understood. Will keep close watch on Student #3.',
      timestamp: '2024-12-19T09:09:00Z',
      type: 'text',
      isRead: true
    }
  ]);

  const activeChannelData = channels.find(c => c.id === activeChannel);
  const channelMessages = messages.filter(m => m.receiverId === activeChannel);

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'proctor': return Users;
      case 'student': return MessageSquare;
      case 'emergency': return AlertTriangle;
      default: return MessageSquare;
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      online: 'bg-green-500',
      busy: 'bg-yellow-500',
      offline: 'bg-gray-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getMessageTypeColor = (type: string) => {
    const colors = {
      text: 'bg-blue-100 text-blue-800',
      alert: 'bg-yellow-100 text-yellow-800',
      emergency: 'bg-red-100 text-red-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleSendMessage = (receiverId: string, message: string, type: 'text' | 'alert' | 'emergency') => {
    const newMessage = {
      id: Date.now().toString(),
      senderId: 'current-supervisor-id',
      senderName: 'You',
      receiverId,
      message,
      timestamp: new Date().toISOString(),
      type,
      isRead: false
    };
    setEnhancedChatMessages(prev => [...prev, newMessage]);
  };

  const handleStartCall = (participantId: string, type: 'voice' | 'video') => {
    const participant = chatParticipants.find(p => p.id === participantId);
    alert(`Starting ${type} call with ${participant?.name}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Communications Center</h1>
            <p className="text-gray-600 mt-2">Real-time communication with proctors and students</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Phone className="w-4 h-4" />
              <span>Voice Call</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Video className="w-4 h-4" />
              <span>Video Call</span>
            </button>
          </div>
        </div>
      </div>

      {/* Communication Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Channels</p>
              <p className="text-3xl font-bold text-gray-900">{channels.length}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Online Proctors</p>
              <p className="text-3xl font-bold text-gray-900">{channels.filter(c => c.type === 'proctor' && c.status === 'online').length}</p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread Messages</p>
              <p className="text-3xl font-bold text-gray-900">{channels.reduce((sum, c) => sum + c.unreadCount, 0)}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Emergency Alerts</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Enhanced Chat Interface */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Enhanced Communications</h3>
          <EnhancedChat
            currentUserId="current-supervisor-id"
            currentUserRole="supervisor"
            participants={chatParticipants}
            messages={enhancedChatMessages}
            onSendMessage={handleSendMessage}
            onStartCall={handleStartCall}
          />
        </div>
      </div>
    </div>
  );
};

export default Communications;