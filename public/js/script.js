
const socket = io();
const messageContainer = document.getElementById("message-con");
const messageText = document.getElementById('message-text');
const sendMessageButton = document.getElementById('send-message-btn');
let view_group ;

document.querySelectorAll(".chat-item").forEach((item) => {
  item.addEventListener("click", function () {
    const user = document.getElementById("Account").innerHTML;
    if (this.querySelector(".joined-status")) {
      const id = this.getAttribute("data-id");
      const name = this.getAttribute("data-name");
      socket.emit("show-chat", { id, name, user });
      setGroupView(name);
      document.getElementById('chat-name').innerHTML = name;
    }
  });
});

sendMessageButton.addEventListener('click', () => {
  const message = messageText.value;
  const user = document.getElementById("Account").innerHTML;
  console.log(user);
  socket.emit('send-message', { user, message, group: view_group });
  create_message(null, message, "text-right");
  messageText.value = "";
});


socket.on("user-joined", (data) => {
  console.log("join");
  create_message(data.user, data.message, "text-left");
});

socket.on('recived-message', (data) => {
  console.log("recived");
  create_message(data.user, data.message, "text-left");
});
  
  

function toggleCreateChatModal() {
  const modal = document.getElementById("createChatModal");
  modal.classList.toggle("hidden");
}

function toggleJoinChatModal() {
  const modal = document.getElementById("joinChatModal");
  modal.classList.toggle("hidden");
}
function setGroupView(value){
  if(view_group === value){
    return;
  }
  view_group = value;
  messageContainer.innerHTML=``;
}

function create_message(user,message,position){

  const newDiv = document.createElement("div");
  const pTag = document.createElement("p");

  // Set the text content of the p tag
  if(user){
    pTag.textContent = user+': '+ message;
  }else{
    pTag.textContent = message;
  }
 

  // Add classes to the new div for styling
  newDiv.classList.add(
    "bg-gray-200",
    "p-3",
    "rounded-lg",
    "shadow",
    "mb-2",
    "border",
    "border-gray-300",
    "w-full",
    "max-w-[43vw]",
    position,
  );

  pTag.classList.add("whitespace-normal", "text-gray-800", "break-words");

  newDiv.appendChild(pTag);

  messageContainer.appendChild(newDiv);

}