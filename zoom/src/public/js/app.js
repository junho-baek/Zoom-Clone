const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#massage");

const socket = new WebSocket(`ws://${window.location.host}`);

//닉네임이랑 메세지를 구분하고 싶어서 json 객체가 필요함.
//서버에 전송하려면 스트링이어야하나 json을 보내고 싶을 땐,
//프론트에선 JSON.stringify
// 벡에선 JSON.parase
function makeMessage(type, payload){
    const msg = {type, payload};
    return JSON.stringify(msg);
}


socket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});

//서버에서 보낸 데이터를 받을 수 있음..!
socket.addEventListener("message", (msg) => {
  const li = document.createElement("li");
  li.innerText = msg.data;
  messageList.append(li);
});

socket.addEventListener("close", () => {
  console.log("Disconnected from Server TㅁT");
});

function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("new_message", input.value));
  input.value = "";
}
function handleNickSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
}
messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
