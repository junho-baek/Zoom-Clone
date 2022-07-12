const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");

const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});

//서버에서 보낸 데이터를 받을 수 있음..!
socket.addEventListener("message", (msg) => {
  console.log("New message:", msg.data);
});

socket.addEventListener("close", () => {
  console.log("Disconnected from Server TㅁT");
});

function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(input.value);
  input.value = "";
}
messageForm.addEventListener("submit", handleSubmit);
