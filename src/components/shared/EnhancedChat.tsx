import React, { useState } from 'react';
import { Send, Users, User, MessageSquare, AlertTriangle, Phone, Video } from 'lucide-react';

interface ChatParticipant {
  id: string;
  name: string;
  role: 'supervisor' | 'proctor' | 'student';
  status: 'online' | 'busy' | 'offline';
  avatar?: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  message: string;
  timestamp: string;
  type: 'text' | 'alert' | 'emergency';
  isRead: boolean;
}

interface EnhancedChatProps {
  currentUserId: string;
  currentUserRole: 'supervisor' | 'proctor';
  participants: ChatParticipant[];
  messages: ChatMessage[];
  onSendMessage: (receiverId: string, message: string, type: 'text' | 'alert' | 'emergency') => void;
  onStartCall?: (participantId: string, type: 'voice' | 'video') => void;
}

const EnhancedChat: React.FC<EnhancedChatProps> = ({
  currentUserId,
  currentUserRole,
  participants,
  messages,
  onSendMessage,
  onStartCall
}) => {
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messageType, setMessageType] = useState<'text' | 'alert' | 'emergency'>('text');
  const [participantFilter, setParticipantFilter] = useState<'all' | 'supervisor' | 'proctor' | 'student'>('all');

  const filteredParticipants = participants.filter(participant => {
    if (participantFilter === 'all') return true;
    return participant.role === participantFilter;
  });

  const selectedParticipantData = participants.find(p => p.id === selectedParticipant);
  const conversationMessages = messages.filter(msg => 
    (msg.senderId === currentUserId && msg.receiverId === selectedParticipant) ||
    (msg.senderId === selectedParticipant && msg.receiverId === currentUserId)
  );

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedParticipant) {
      onSendMessage(selectedParticipant, newMessage, messageType);
      setNewMessage('');
      setMessageType('text');
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

  const getRoleColor = (role: string) => {
    const colors = {
      supervisor: 'text-purple-600',
      proctor: 'text-blue-600',
      student: 'text-orange-600'
    };
    return colors[role as keyof typeof colors] || 'text-gray-600';
  };

  const getMessageTypeColor = (type: string) => {
    const colors = {
      text: 'bg-blue-100 text-blue-800',
      alert: 'bg-yellow-100 text-yellow-800',
      emergency: 'bg-red-100 text-red-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getUnreadCount = (participantId: string) => {
    return messages.filter(msg => 
      msg.senderId === participantId && 
      msg.receiverId === currentUserId && 
      !msg.isRead
    ).length;
  };

  const [isMobileView, setIsMobileView] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96 flex flex-col md:flex-row">
      {/* Participants List */}
      <div className={`${isMobileView ? 'w-full' : 'w-1/3'} border-r border-gray-200 flex flex-col ${selectedParticipant && isMobileView ? 'hidden' : ''}`}>
        <div className="p-3 sm:p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Communications</h3>
            <MessageSquare className="w-4 h-4 text-gray-600" />
          </div>
          <select
            value={participantFilter}
            onChange={(e) => setParticipantFilter(e.target.value as any)}
            className="w-full text-xs sm:text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="all">All Participants</option>
            <option value="supervisor">Supervisors</option>
            <option value="proctor">Proctors</option>
            <option value="student">Students</option>
          </select>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredParticipants.map((participant) => {
            const unreadCount = getUnreadCount(participant.id);
            return (
              <button
                key={participant.id}
                onClick={() => setSelectedParticipant(participant.id)}
                className={`w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 ${
                  selectedParticipant === participant.id ? 'bg-blue-50 border-l-2 sm:border-l-4 border-l-blue-600' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={participant.avatar || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&dpr=1'}
                        alt={participant.name}
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                      />
                      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(participant.status)}`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate text-sm">{participant.name}</p>
                      <p className={`text-xs capitalize ${getRoleColor(participant.role)} hidden sm:block`}>
                        {participant.role}
                      </p>
                    </div>
                  </div>
                  {unreadCount > 0 && (
                    <span className="inline-block w-5 h-5 bg-red-500 text-white text-xs rounded-full text-center leading-5">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!selectedParticipant && isMobileView ? 'hidden' : ''}`}>
        {selectedParticipant ? (
          <>
            {/* Chat Header */}
            <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  {isMobileView && (
                    <button
                      onClick={() => setSelectedParticipant(null)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      ← Back
                    </button>
                  )}
                  <img
                    src={selectedParticipantData?.avatar || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&dpr=1'}
                    alt={selectedParticipantData?.name}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{selectedParticipantData?.name}</h3>
                    <p className={`text-xs sm:text-sm capitalize ${getRoleColor(selectedParticipantData?.role || '')}`}>
                      {selectedParticipantData?.role}
                    </p>
                  </div>
                </div>
                {onStartCall && (
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <button
                      onClick={() => onStartCall(selectedParticipant, 'voice')}
                      className="p-1 sm:p-2 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={() => onStartCall(selectedParticipant, 'video')}
                      className="p-1 sm:p-2 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      <Video className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
              {conversationMessages.length === 0 ? (
                <div className="text-center text-gray-500 text-xs sm:text-sm">
                  No messages yet. Start a conversation!
                </div>
              ) : (
                conversationMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                      message.senderId === currentUserId 
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <div className="flex items-center justify-between mb-1 flex-wrap">
                        <span className="text-xs font-medium opacity-75 truncate">{message.senderName}</span>
                        {message.type !== 'text' && (
                          <span className={`px-1 py-0.5 rounded text-xs ml-1 ${getMessageTypeColor(message.type)}`}>
                            {message.type}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm break-words">{message.message}</p>
                      <div className="text-xs opacity-75 mt-1 text-right">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="p-3 sm:p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 mb-2 flex-wrap">
                <select
                  value={messageType}
                  onChange={(e) => setMessageType(e.target.value as any)}
                  className="text-xs border border-gray-300 rounded px-2 py-1 flex-shrink-0"
                >
                  <option value="text">Normal</option>
                  <option value="alert">Alert</option>
                  <option value="emergency">Emergency</option>
                </select>
                <span className="text-xs text-gray-500 truncate">
                  to {selectedParticipantData?.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-lg px-2 sm:px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 p-4">
            <div className="text-center">
              <MessageSquare className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm sm:text-base">Select a participant to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedChat;