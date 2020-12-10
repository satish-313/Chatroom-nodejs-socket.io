const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const formatMessage = require('./utils/messages')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

/* Set static folder */
app.use(express.static(path.join(__dirname,'public')));

const Admin = 'Admin'

// run when client connects
io.on('connection', socket => {
  // join room in server
  /* socket.on('joinRoom',({username,room}))
 */
  // welcome current user
  socket.emit('message',formatMessage(Admin,'Welcome to chatroom'));

  // Broadcast when a user connects
  socket.broadcast.emit('message',formatMessage(Admin,'A user has joined the chat'));

  // Run when someone disconnets
  socket.on('disconnect', ()=>{
    io.emit('message',formatMessage(Admin,'A user has left the chat'));
  })

  // Listen for chatmessage
  socket.on('chatMessage', (msg) => {
    io.emit('message',formatMessage('USER',msg));
  })
})

const PORT = 3000 || process.env.PORT

server.listen(PORT, () => console.log(`Server running ${PORT}`));