const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, getRoomUsers, userLeave } = require('./utils/user');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

/* Set static folder */
app.use(express.static(path.join(__dirname, 'public')));

const Admin = 'Admin'

// run when client connects
io.on('connection', socket => {

  // join room in server
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // welcome current user
    socket.emit('message', formatMessage(Admin, 'Welcome to chatroom'));

    // Broadcast when a user connects
    socket.broadcast.to(user.room).emit('message', formatMessage(Admin, `A ${user.username} has joined the chat`));

    // send users and rooms info
    io.to(user.room).emit('roomUsers' , {
      room : user.room,
      users : getRoomUsers(user.room)
    });
  })

  // Listen for chatmessage
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id)
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  })

  // Run when someone disconnets
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    if(user){
      io.to(user.room).emit('message', formatMessage(Admin, `A ${user.username} has left the chat`));
    }
    io.to(user.room).emit('roomUsers' , {
      room : user.room,
      users : getRoomUsers(user.room)
    });
  })
})

const PORT = 3000 || process.env.PORT

server.listen(PORT, () => console.log(`Server running ${PORT}`));