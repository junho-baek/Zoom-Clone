//이거면 소켓 연결;; 엄청 간편하다..
const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

//벡엔드에 신호 요청을 하고 나중에 실행될 콜백함수
//벡엔드에서 인자를 부여할 수도 있다.
function backendDone(msg){
  console.log(`The backend says: ${msg}`);
}



function handleRoomSubmit(event){
  event.preventDefault();
  const input = form.querySelector("input");
  //socket.emit 은 완전 멋진거임. 이벤트를 생성하고, 자유롭게 인자를 줄 수 있음. 
  //그 인자가 스트링일 필요도 없고 오브젝트여도 됌..!!
  //콜백함수도 가능.. 서버에 콜백함수를 전달하고 서버에서 실행이 되면, 프런트에서 지정한 함수가 콜백돼서 실행됌. 정말 쩌는 기술이다..
  socket.emit("enter_room", input.value, backendDone);
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);