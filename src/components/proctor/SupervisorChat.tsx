import React, { useState } from 'react';
import EnhancedChat from '../shared/EnhancedChat';
import { Send, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  type: 'supervisor' | 'proctor';
}

export default function SupervisorChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Enhanced chat participants
  const [chatParticipants] = useState([
    { id: 'sup1', name: 'Sarah Supervisor', role: 'supervisor' as const, status: 'online' as const },
    { id: 'sup2', name: 'Mike Supervisor', role: 'supervisor' as const, status: 'busy' as const },
    { id: 'p1', name: 'John Proctor', role: 'proctor' as const, status: 'online' as const },
    { id: 'p2', name: 'Sarah Monitor', role: 'proctor' as const, status: 'online' as const },
    { id: 's1', name: 'Alex Smith', role: 'student' as const, status: 'online' as const },
    { id: 's2', name: 'Emma Johnson', role: 'student' as const, status: 'online' as const }
  ]);
  
  const [enhancedChatMessages, setEnhancedChatMessages] = useState<any[]>([]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: 'Proctor',
        content: newMessage,
        timestamp: new Date(),
        type: 'proctor'
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleSendEnhancedMessage = (receiverId: string, message: string, type: 'text' | 'alert' | 'emergency') => {
    const newMessage = {
      id: Date.now().toString(),
      senderId: 'current-proctor-id',
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Communications</h1>
            <p className="text-gray-600 mt-2">Chat with supervisors and students</p>
          </div>
        </div>
      </div>
      
      {/* Enhanced Chat */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Enhanced Communications</h3>
        <EnhancedChat
          currentUserId="current-proctor-id"
          currentUserRole="proctor"
          participants={chatParticipants}
          messages={enhancedChatMessages}
          onSendMessage={handleSendEnhancedMessage}
          onStartCall={handleStartCall}
        />
      </div>
    </div>
  );
}