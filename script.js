let currentUser = null;

// Helper functions for localStorage
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function loadData(key) {
  return JSON.parse(localStorage.getItem(key)) || {};
}

// Login Functionality
function login() {
  const username = document.getElementById("username").value.trim();
  if (!username) return alert("Username is required!");

  const users = loadData("users");
  if (!users[username]) {
    users[username] = { friends: [], requests: [], chats: {} };
    saveData("users", users);
  }
  currentUser = username;
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("chat-screen").classList.remove("hidden");
  loadFriends();
}

// Load Friends and Requests
function loadFriends() {
  const users = loadData("users");
  const user = users[currentUser];

  const requestsList = document.getElementById("friend-requests");
  const friendsList = document.getElementById("friends");

  requestsList.innerHTML = user.requests
    .map(request => `<li onclick="acceptRequest('${request}')">${request}</li>`)
    .join("");
  friendsList.innerHTML = user.friends
    .map(friend => `<li onclick="startChat('${friend}')">${friend}</li>`)
    .join("");
}

// Send and Accept Friend Requests
function sendRequest(username) {
  const users = loadData("users");
  if (!users[username]) return alert("User not found!");

  if (!users[username].requests.includes(currentUser)) {
    users[username].requests.push(currentUser);
    saveData("users", users);
    alert("Friend request sent!");
  }
}

function acceptRequest(username) {
  const users = loadData("users");
  const user = users[currentUser];

  user.requests = user.requests.filter(req => req !== username);
  if (!user.friends.includes(username)) {
    user.friends.push(username);
    users[username].friends.push(currentUser);
  }
  saveData("users", users);
  loadFriends();
}

// Chat Functionality
let activeChat = null;

function startChat(friend) {
  activeChat = friend;
  document.getElementById("chat-header").innerText = `Chat with ${friend}`;
  loadMessages();
}

function loadMessages() {
  const users = loadData("users");
  const user = users[currentUser];

  const messages = user.chats[activeChat] || [];
  document.getElementById("chat-messages").innerHTML = messages
    .map(msg => `<p><strong>${msg.from}:</strong> ${msg.text}</p>`)
    .join("");
}

function sendMessage() {
  const message = document.getElementById("chat-input").value.trim();
  if (!message) return;

  const users = loadData("users");
  const user = users[currentUser];
  const friend = users[activeChat];

  if (!user.chats[activeChat]) user.chats[activeChat] = [];
  if (!friend.chats[currentUser]) friend.chats[currentUser] = [];

  const chatMessage = { from: currentUser, text: message };
  user.chats[activeChat].push(chatMessage);
  friend.chats[currentUser].push(chatMessage);

  saveData("users", users);
  document.getElementById("chat-input").value = "";
  loadMessages();
}
