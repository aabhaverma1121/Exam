const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Store active sessions and users
const activeSessions = new Map();
const connectedUsers = new Map();
const examSessions = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user authentication
  socket.on('authenticate', (userData) => {
    connectedUsers.set(socket.id, userData);
    socket.join(`role_${userData.role}`);
    
    if (userData.role === 'proctor' || userData.role === 'supervisor') {
      socket.join('monitoring_room');
    }
    
    console.log(`${userData.role} ${userData.name} connected`);
  });

  // Handle exam session joining
  socket.on('join_session', (sessionId) => {
    socket.join(`session_${sessionId}`);
    console.log(`User joined session: ${sessionId}`);
  });

  // Handle exam session leaving
  socket.on('leave_session', (sessionId) => {
    socket.leave(`session_${sessionId}`);
    console.log(`User left session: ${sessionId}`);
  });

  // Handle real-time messages
  socket.on('send_message', (messageData) => {
    const sender = connectedUsers.get(socket.id);
    const message = {
      id: Date.now().toString(),
      senderId: sender?.id || socket.id,
      senderName: sender?.name || 'Unknown',
      receiverId: messageData.receiverId,
      message: messageData.message,
      type: messageData.type,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    // Send to specific user or broadcast to role
    if (messageData.receiverId.startsWith('role_')) {
      io.to(messageData.receiverId).emit('new_message', message);
    } else {
      io.to(messageData.receiverId).emit('new_message', message);
    }

    console.log('Message sent:', message);
  });

  // Handle incident reporting
  socket.on('report_incident', (incidentData) => {
    const reporter = connectedUsers.get(socket.id);
    const incident = {
      id: Date.now().toString(),
      ...incidentData,
      reporterId: reporter?.id || socket.id,
      reporterName: reporter?.name || 'Unknown',
      timestamp: new Date().toISOString()
    };

    // Notify supervisors and admins
    io.to('role_supervisor').emit('incident_reported', incident);
    io.to('role_admin').emit('incident_reported', incident);

    console.log('Incident reported:', incident);
  });

  // Handle warning issuance
  socket.on('issue_warning', (warningData) => {
    const issuer = connectedUsers.get(socket.id);
    const warning = {
      id: Date.now().toString(),
      ...warningData,
      issuerId: issuer?.id || socket.id,
      issuerName: issuer?.name || 'Unknown',
      timestamp: new Date().toISOString()
    };

    // Notify session participants
    io.to(`session_${warningData.sessionId}`).emit('warning_issued', warning);
    
    // Notify supervisors
    io.to('role_supervisor').emit('warning_issued', warning);

    console.log('Warning issued:', warning);
  });

  // Handle session status updates
  socket.on('update_session_status', (statusData) => {
    const session = examSessions.get(statusData.sessionId);
    if (session) {
      session.status = statusData.status;
      session.lastUpdate = new Date().toISOString();
      
      // Broadcast session update
      io.to(`session_${statusData.sessionId}`).emit('session_update', session);
      io.to('monitoring_room').emit('session_update', session);
    }
  });

  // Handle AI detection alerts
  socket.on('ai_detection', (detectionData) => {
    const detection = {
      id: Date.now().toString(),
      ...detectionData,
      timestamp: new Date().toISOString()
    };

    // Notify proctors and supervisors
    io.to('role_proctor').emit('ai_detection', detection);
    io.to('role_supervisor').emit('ai_detection', detection);

    console.log('AI detection:', detection);
  });

  // Handle exam start
  socket.on('start_exam', (examData) => {
    const session = {
      id: Date.now().toString(),
      ...examData,
      startTime: new Date().toISOString(),
      status: 'active',
      isLive: true
    };

    examSessions.set(session.id, session);
    
    // Notify all monitoring users
    io.to('monitoring_room').emit('exam_started', session);
    
    console.log('Exam started:', session);
  });

  // Handle exam end
  socket.on('end_exam', (examData) => {
    const session = examSessions.get(examData.sessionId);
    if (session) {
      session.status = 'completed';
      session.endTime = new Date().toISOString();
      session.isLive = false;
      
      // Notify all monitoring users
      io.to('monitoring_room').emit('exam_ended', session);
      
      console.log('Exam ended:', session);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      console.log(`${user.role} ${user.name} disconnected`);
      connectedUsers.delete(socket.id);
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    connections: connectedUsers.size,
    activeSessions: examSessions.size
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Real-time server running on port ${PORT}`);
});