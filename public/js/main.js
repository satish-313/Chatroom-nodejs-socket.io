const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from url
const { username,room} = Qs.parse(location.search,{
  ignoreQueryPrefix:true
});
/* console.log(username,room) */

// Join chatroom
socket.emit('joinRoom',{username,room})

// Get room and user
socket.on('roomUsers', ({room, users}) => {
  outputRoomName(room);
  outputUsers(users);
});

// massage from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // get msg text
  const msg = e.target.elements.msg.value;

  // emit message to server
  socket.emit('chatMessage',msg);

  // clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// output message to DOM
function outputMessage(message){
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML =  `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
  ${message.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
};

// add room name to Dom
function outputRoomName(room){
  roomName.innerHTML = room;
}

// add user to DOM
function outputUsers(users){
  userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}