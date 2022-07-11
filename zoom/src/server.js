import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname +"/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req,res) => res.render("home"));
app.get("/*", (req,res) => res.redirect("/"));
const handleListen = () => console.log(`Listening on http://localhost:3000`)

//http 모듈을 이용해서 서버를 만들자
const server = http.createServer(app);
//WebSocket 서버를 만들자
const wss = new WebSocket.Server({ server }); //이렇게 하면 http 서버와 같은 포트에서 함께 돌릴 수 있다. ws 서버만 돌려도 됌. 꼭 이렇게 하라는 건 아님


server.listen(3000, handleListen);