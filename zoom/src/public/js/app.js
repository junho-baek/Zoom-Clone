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

//10초 뒤에 서버에 메세지를 보낸다
setTimeout(() => {
  socket.send("hello from the browser!");
}, 10000);
