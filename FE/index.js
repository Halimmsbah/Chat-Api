const socket = io('http://localhost:3000');

let messages = [];
let toId = '';
let token = localStorage.getItem('token');

socket.emit('updateSocketId', { token });

socket.on("retrievedMessages", (data) => {
  messages = data.messages;
  displayMessages();
});

socket.on("newMessage", (data) => {
  messages.push(data.message);
  displayMessages();
});

const displayMessages = () => {
  const messagesContainer = document.querySelector('section');
  messagesContainer.innerHTML = '';

  messages.forEach((post) => {
    const card = document.createElement('div');
    card.classList = 'card text-left';

    const cardBody = document.createElement('div');
    cardBody.classList = 'card-body';

    const cardText = document.createElement('p');
    cardText.classList = 'card-text';
    cardText.textContent = post.text; // Ensure this matches the message schema field

    cardBody.appendChild(cardText);
    card.appendChild(cardBody);
    messagesContainer.appendChild(card);
  });
};

document.querySelector('#startChatForm').addEventListener('submit', handleStartChat);
document.querySelector('#sendMessageForm').addEventListener('submit', handleSendMessage);

const handleStartChat = (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const userId = formData.get('user-id');
  toId = userId;
  socket.emit('getMessage', { token, to: toId });
};

const handleSendMessage = (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const text = formData.get('message');
  socket.emit('addMessage', { token, to: toId, text });
};
