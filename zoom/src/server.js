import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));
const handleListen = () => console.log(`Listening on http://localhost:3000`);

//http 모듈을 이용해서 서버를 만들자
const server = http.createServer(app);
//WebSocket 서버를 만들자
const wss = new WebSocket.Server({ server }); //이렇게 하면 http 서버와 같은 포트에서 함께 돌릴 수 있다. ws 서버만 돌려도 됌. 꼭 이렇게 하라는 건 아님

//현 상태를 알기 쉽게 표현한 함수 표현 방식
//connection 이벤트가 달리면 socket을 통해서 어느 클라이언트인지 알 수 있다.
//wss 는 전체 웹소켓 서버고 socket은 연결된 각각의 브라우저이다.
wss.on("connection", (socket) => {
  console.log("Connected to Browser ✅");
  socket.on("message", (message) => {
    console.log(message.toString());
  });
  socket.on("close", () => {
    console.log("Disconnected from Browser TㅁT");
  });
  socket.send("hello!!");
});

server.listen(3000, handleListen);
