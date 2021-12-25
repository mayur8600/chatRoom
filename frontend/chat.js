const chatForm = document.getElementById('chatForm');
const chatMessages = document.querySelector('.chatMessages');
const roomName = document.getElementById('roomName');
const userList = document.getElementById('users');
const msg = document.getElementById('msg')

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});


document.querySelector(".yourName").innerText = username;
const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
  
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;
  console.log(msg)

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  console.log(message.username)
  const div = document.createElement('div');
  const divpointer = document.createElement('div');
  div.classList.add('message');
  if(message.username === username){
    div.classList.add('left');
    divpointer.classList.add("pointer")
  }
  else{
    div.classList.add('right');
    divpointer.classList.add("pointerR")
  }
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  div.appendChild(divpointer);
  document.querySelector('.chatMessages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = './index.html';
  } else {
  }
});

msg.addEventListener('focus', (e) => {
  socket.emit('feedback',{
    feedback: `${username} is typing message`
  })
});

msg.addEventListener('keypress', (e) => {
  socket.emit('feedback',{
    feedback: `${username} is typing message`
  })
});

msg.addEventListener('blur', (e) => {
  socket.emit('feedback',{
    feedback: ""
  })
});

socket.on('feedback', (data) => {
  const element = `
    
    <p class="feedback" id="feedback">${data.feedback}</p>
  `
  document.getElementById('msgcont').innerHTML = element;
})

// function clearFeedback(){
//   document.getElementById('msgcont').forEach(e =>{
//     e.parentNode.removeChild(e);
//   })
// }
