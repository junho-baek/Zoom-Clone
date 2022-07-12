import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname +"/views");
app.set('port', process.env.PORT || 3000);
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req,res) => res.render("home"));
app.get("/*", (req,res) => res.redirect("/"));
const handleListen = () => console.log(`Listening on ${process.env.PORT}`)

//http 모듈을 이용해서 서버를 만들자
const server = http.createServer(app);
//WebSocket 서버를 만들자
//기존 방법은 ws 버전에 따른 문제가 야기돼서 새롭게 코드를 짰다.
const wss = new WebSocketServer({ server }); //이렇게 하면 http 서버와 같은 포트에서 함께 돌릴 수 있다. ws 서버만 돌려도 됌. 꼭 이렇게 하라는 건 아님

function handleConnection(socket){
  console.log(socket);
}

// 소켓은 연결 라인이다. 
wss.on("connection", handleConnection);

server.listen(process.env.PORT, handleListen);