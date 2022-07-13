# 0 INTRODUCTION

## 0.0 Welcome

- zoom 클론 코딩: 실시간 기능 구현이 얼마나 쉬운지 알 수 있을 것이다.

## 0.1 Requirements

- 요구사항:
  > Express, Pug, app.get(), (req, res), package.json/ babel / nodemon 등 기본적인 node 벡엔드  
  > javascript 기본

## 0.2 Server Setup

- shell
  ```shell
  mkdir zoom
  cd zoom
  npm init -y
  npm i nodemon -D
  touch babel.config.json
  touch nodemon.json
  mkdir src
  cd src
  touch server.js
  cd ..
  git init
  npm i @babel/core @babel/cli @babel/node @babel/preset-env -D
  touch .gitignore
  npm i express //express로 서버 구성
  npm i pug //pug 엔진을 설치
  ```
- package.json

  ```json
  {
    "name": "zoom",
    "version": "1.0.0",
    "description": "Zoom Clone using WebRTC and Websockets",
    "license": "MIT",
    "devDependencies": {
      "nodemon": "^2.0.19"
    }
  }
  ```

- nodemon.json
  - src의 server.js 의 파일 변경 감지해서 nodemon 실행(자동적으로 앱 실행)
  ```json
  {
    "exec": "babel-node src/server.js"
  }
  ```
- babel.config.json
  - js 최신문법 번역을 위한 설정
  ```json
  {
    "presets": ["@babel/preset-env"]
  }
  ```
- .gitignore

  - git push를 할때 node_modules을 가져가면 안됌. 너무 큼

  ```gitignore
  /node_modules
  ```

- package.json

  - script에 dev 명령어 추가- nodemon을 실행시킴

  ```json
  {
    "name": "zoom",
    "version": "1.0.0",
    "description": "Zoom Clone using WebRTC and Websockets",
    "license": "MIT",
    "scripts": {
      "dev": "nodemon"
    },
    "devDependencies": {
      "@babel/cli": "^7.18.6",
      "@babel/core": "^7.18.6",
      "@babel/node": "^7.18.6",
      "@babel/preset-env": "^7.18.6",
      "nodemon": "^2.0.19"
    },
    "dependencies": {
      "express": "^4.18.1",
      "pug": "^3.0.2"
    }
  }
  ```

- server.js

  - 시험용 서버

  ```js
  import express from "express";

  const app = express();

  console.log("hello");

  app.listen(3000);
  ```

## 0.3 Frontend Setup

- src 폴더에 public 폴더 생성 그 안에 js 폴더 생성 그 안에 app.js 파일 생성
- src 폴더에 views 폴더 생성 그 안에 home.pug 파일 생성

- home.pug

  - mvp css 를 링크로 줬음

  ```pug
  doctype html
  html(lang="en")
      head
          meta(charset="UTF-8")
          meta(http-equiv="X-UA-Compatible", content="IE=edge")
          meta(name="viewport", content="width=device-width, initial-scale=1.0")
          title ZoomClone
          link(rel="stylesheet",href="https://unpkg.com/mvp.css")
      body
          header
              h1 ZoomClone
          main
              h2 Welcome to ZoomClone

          script(src="/public/js/app.js")


  ```

- server.js

  - 퍼그 엔진을 세팅하고, 퍼그 엔진이 있는 디렉토리를 세팅하고
  - 스태틱 폴더로 퍼블릭을 지정하고
  - 리퀘스트가 오면 리스폰으로 home을 만들어줌

  ```js
  import express from "express";

  const app = express();

  app.set("view engine", "pug");
  app.set("views", __dirname + "/views");
  app.use("/public", express.static(__dirname + "/public"));
  app.get("/", (req, res) => res.render("home"));

  const handleListen = () => console.log(`Listening on http://localhost:3000`);
  app.listen(3000, handleListen);
  ```

- nodemon.json
  - 프런트엔드 자바스크립트 건드릴 땐, nodemon 실행 안되도록 설정!
  ```json
  {
    "ignore": ["src/puclic/*"],
    "exec": "babel-node src/server.js"
  }
  ```

## 0.4 Recap

- 개발 환경 세팅을 했음

- sever.js

  ```js
  import express from "express";

  const app = express();

  app.set("view engine", "pug");
  app.set("views", __dirname + "/views");
  app.use("/public", express.static(__dirname + "/public"));
  app.get("/", (req, res) => res.render("home"));
  app.get("/*", (req, res) => res.redirect("/"));
  const handleListen = () => console.log(`Listening on http://localhost:3000`);
  app.listen(3000, handleListen);
  ```

---

# 1 CHAT WITH WEBSOCKET

## 1.0 Introduction

### 실시간 채팅 앱을 만들어보자

> 구현 기능
>
> - 닉네임 설정
> - 채팅방 입장/퇴장 공지
> - 실시간 채팅

## 1.1 HTTP vs WebSockets

### http

> - req에 해당하는 res를 제공
> - stateless
> - res 이후 유저를 기억할 수 없다.
> - 이미 유저 인증을 했다면 쿠키를 제공해야함
> - real time 이 아님
> - 브라우저는 req만 할 수 있음

### web socket

> - req를 보내면 accept 아니면 거절을 함
> - accept되면 브라우저와 서버는 쭉 연결이 되어 있음.
> - 연결돼있기 때문에, 유저를 기억할 수 있음
> - 서버가 브라우저에 메세지를 보낼 수 있음
> - 브라우저도 서버에 메세지를 보낼 수 있음
> - 실시간 서비스가 가능한 이유임
> - 양방향
> - 브라우저와 벡엔드 간의 연결에만 국한된 것이 아님.
> - api 통신, 벡엔드 끼리 통신에도 이용될 수 있음

## 1.2 WebSockets in NodeJS

### nodeJS로 웹소켓 서버를 만들어보자.

> ws라는 패키지 도움을 받을 것임  
> ws 는 웹 소켓 프로토콜(일종의 규약)을 단순히 이식(implementation)한 패키지일 뿐! 기본이고 근본인 것  
> 웹소켓을 이용한 라이브러리는 거의 모든 언어에 존재한다.  
> 추후에는 이 패키지 이용하지 않을거임.  
> ws를 기반으로 만든 framework를 사용할 거고 거기에는 채팅방 기능이 이미 구현돼 있음

- 먼저 ws 패키지를 만들어 준다.
  > shell
  >
  > ```shell
  > npm i ws
  > ```
- 서버 작업을 하자
  - express 에 http를 다루는 서버에다가 ws 를 다루는 함수를 추가하자
    > server.js

```js
import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));
const handleListen = () => console.log(`Listening on http://localhost:3000`);

//http 모듈을 이용해서 서버를 만들자
const server = http.createServer(app);
//WebSocket 서버를 만들자
const wss = new WebSocket.Server({ server }); //이렇게 하면 http 서버와 같은 포트에서 함께 돌릴 수 있다. ws 서버만 돌려도 됌. 꼭 이렇게 하라는 건 아님

server.listen(3000, handleListen);
```

## 1.3 WebSocket Events

### 웹 소켓은 이벤트가 있으면 함수를 호출시킴. 프론트엔드 스크립트와 비슷하다

> server.js

```js
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

//브라우저 내의 코드와 비슷하다
function handleConnection(socket) {
  console.log(socket);
}

// 소켓은 연결 라인이다.
wss.on("connection", handleConnection);

server.listen(3000, handleListen);
```

> app.js
>
> - window.location 은 브라우저가 돌아가는 환경, 프로토콜, 호스트 등을 알려준다

```js
const socket = new WebSocket(`ws://${window.location.host}`);
```

## 1.4 WebSocket Messages

### 소켓을 이용하여 브라우저와 서버 간 데이터를 실시간으로 주고받아보자

> server.js
>
> - socket.on() 을 이용하면, socket이 연결되어 있을 때 다양한 소켓 이벤트에 함수를 호출할 수 있다.
> - 브라우저에 데이터를 전송할 땐, socket.send 이건 서버와 브라우저 공통이다.

```js
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
```

> app.js
>
> - socket.addEventListener 로 서버와의 이벤트에 함수를 호출 할 수 있게 된다.
> - socket.send 로 서버에 데이터를 전송할 수 있다.

```js
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
```

## 1.5 Recap

### 복습해보자

> server.js
>
> - wss.on("connection",)이 여러개 생길 수 있고
>   브라우저는 socket인 것.. 마치 Room처럼 작동

```js
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
```

## 1.6 Chat Completed

### 채팅 기능을 완성해보자

> home.pug
>
> - form을 추가해줍니다

```pug
doctype html
html(lang="en")
    head
        meta(charset="UTF-8")
        meta(http-equiv="X-UA-Compatible", content="IE=edge")
        meta(name="viewport", content="width=device-width, initial-scale=1.0")
        title ZoomClone
        link(rel="stylesheet",href="https://unpkg.com/mvp.css")
    body
        header
            h1 ZoomClone
        main
            h2 Welcome to ZoomClone
            ul
            form
                input(type="text", placeholder="write a msg", required)
                button  Send

        script(src="/public/js/app.js")


```

> server.js

```js
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

//wss.on("connection") 이 발생할 때 입장한 (브라우저들)소켓들을 넣어줄 배열
const sockets = [];

//현 상태를 알기 쉽게 표현한 함수 표현 방식
//connection 이벤트가 달리면 socket을 통해서 어느 클라이언트인지 알 수 있다.
//wss 는 전체 웹소켓 서버고 socket은 연결된 각각의 브라우저이다.
wss.on("connection", (socket) => {
  sockets.push(socket);
  console.log("Connected to Browser ✅");
  socket.on("close", () => {
    console.log("Disconnected from Browser TㅁT");
  });
  //for 문을 이용해서 모든 소켓들에게 메시지를 전송한다!
  socket.on("message", (message) => {
    sockets.forEach((aSocket) => aSocket.send(message.toString()));
  });
});

server.listen(3000, handleListen);
```

> app.js

```js
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
```

## 1.7 Nicknames Part One

### 닉네임을 추가해보자

> home.pug

```pug
doctype html
html(lang="en")
    head
        meta(charset="UTF-8")
        meta(http-equiv="X-UA-Compatible", content="IE=edge")
        meta(name="viewport", content="width=device-width, initial-scale=1.0")
        title ZoomClone
        link(rel="stylesheet",href="https://unpkg.com/mvp.css")
    body
        header
            h1 ZoomClone
        main
            h2 Welcome to ZoomClone
            form#nick
                input(type="text", placeholder="choose a nickname", required)
                button  Save
            ul
            form#message
                input(type="text", placeholder="write a msg", required)
                button  Send

        script(src="/public/js/app.js")


```

> app.js
>
> - socket.send 로 닉네임과 메세지를 구분하지 못함
> - 그래서 json으로 구분할 수 있게 만드려고 했음
> - 근데 socket.send 는 프론트에서 벡으로 전송할 때 스트링만 받음
> - 이럴 때는 JSON.stringify!!

```js
const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#massage");

const socket = new WebSocket(`ws://${window.location.host}`);

//닉네임이랑 메세지를 구분하고 싶어서 json 객체가 필요함.
//서버에 전송하려면 스트링이어야하나 json을 보내고 싶을 땐,
//프론트에선 JSON.stringify
// 벡에선 JSON.parase
function makeMessage(type, payload) {
  const msg = { type, payload };
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
```

## 1.8 Nicknames Part Two

### 벡에서 닉네임과 메시지를 구분해보자!

> server.js

```js
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

//wss.on("connection") 이 발생할 때 입장한 (브라우저들)소켓들을 넣어줄 배열
const sockets = [];

//현 상태를 알기 쉽게 표현한 함수 표현 방식
//connection 이벤트가 달리면 socket을 통해서 어느 클라이언트인지 알 수 있다.
//wss 는 전체 웹소켓 서버고 socket은 연결된 각각의 브라우저이다.
wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "익명";
  console.log("Connected to Browser ✅");
  socket.on("close", () => {
    console.log("Disconnected from Browser TㅁT");
  });
  //for 문을 이용해서 모든 소켓들에게 메시지를 전송한다!
  socket.on("message", (msg) => {
    const message = JSON.parse(msg.toString());

    switch (message.type) {
      case "new_message":
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname}: ${message.payload}`)
        );
      case "nickname":
        socket["nickname"] = message.payload; // 소켓도 객체라서 새로운 정보를 저장할 수 있다.
    }
  });
});

server.listen(3000, handleListen);
```

## 1.9 Conclusions

### 결론

> 웹소켓 기본 라이브러리로 실시간 기능을 만드는 데에 문제가 없었지만, 스트링을 JSON으로 바꾼다거나 하는 과정이 필요하는 둥 번거로운 과정이 필요했고, 불편한 과정들이 있었음. 챕터 2에서는 웹소켓을 이용하는 프레임 워크를 사용해서 더욱 편리하게 실시간 기능을 만들 것임.

----
### 번외
> http 위에 웹소켓을 올리려면 ws 프로토콜을 써야하지만, https 위에 웹소켓을 올리려면 wss를 써야한다. 코드샌드박스나, 레플릿은 https를 사용해서 wss를 써줘야 작동한다!
```js
//https 보안 연결을 하려면 ws 가 아니라 wss를 써야함...!!!!!!!!!!!!
// repl.it 이나 코드 샌드박스에서 안되던 이유를 드디어 찾았다..!!
const socket = new WebSocket(`wss://${window.location.host}`);
```

---

## 2.0 SocketIO vs WebSockets
### WebSocket을 이용해서 쉽게 실시간 기능을 만들어주는 framework를 배워보자!

- socket.io: 양방향, 실시간, 이벤트 기반 통신을 도와줌. 웹소켓이랑 거의 유사하나 더 기능이 많고, 웹소켓을 이용하는 프레임워크임. 웹소켓만 이용하는 것은 아님. 웹소켓이 제대로 작동하지 않으면, 다른 프로토콜, 프록시 등을 이용함.

## 2.1 Installing SocketIO
### 소켓아이오를 설치하고 서버를 만들어보자

> shell
 ```shell
 npm i socket.io
 ```

> app.js
```js
//이거면 소켓 연결;; 엄청 간편하다..
const socket = io();
```

> server.js
> - 기존의 웹 소켓 서버를 없애고 소켓아이오를 임포트 해온 뒤 아이오서버를 만들었습니다. 똑같이 커넥션 이벤트가 생기면 소켓을 받을 수 있는데, 콘솔로그 찍어보면 조금 달라진 소켓을 확인할 수 있습니다. 연결된 소켓들이 표시된다는 것과 같이 조금 더 자세한 소켓 정보가 찍히는걸 확인할 수 있네요
```js
import http from "http";
// import WebSocket from "ws";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));
const handleListen = () => console.log(`Listening on http://localhost:3000`);

//http 모듈을 이용해서 서버를 만들자
const httpServer = http.createServer(app);

// socket.io 서버를 만들어주자
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  console.log(socket);
})

// //WebSocket 서버를 만들자
// const wss = new WebSocket.Server({ server }); //이렇게 하면 http 서버와 같은 포트에서 함께 돌릴 수 있다. ws 서버만 돌려도 됌. 꼭 이렇게 하라는 건 아님

// //wss.on("connection") 이 발생할 때 입장한 (브라우저들)소켓들을 넣어줄 배열
// const sockets = [];

// //현 상태를 알기 쉽게 표현한 함수 표현 방식
// //connection 이벤트가 달리면 socket을 통해서 어느 클라이언트인지 알 수 있다.
// //wss 는 전체 웹소켓 서버고 socket은 연결된 각각의 브라우저이다.
// wss.on("connection", (socket) => {
//   sockets.push(socket);
//   socket["nickname"] = "익명";
//   console.log("Connected to Browser ✅");
//   socket.on("close", () => {
//     console.log("Disconnected from Browser TㅁT");
//   });
//   //for 문을 이용해서 모든 소켓들에게 메시지를 전송한다!
//   socket.on("message", (msg) => {
//     const message = JSON.parse(msg.toString());

//     switch (message.type) {
//       case "new_message":
//         sockets.forEach((aSocket) =>
//           aSocket.send(`${socket.nickname}: ${message.payload}`)
//         );
//       case "nickname":
//         socket["nickname"] = message.payload; // 소켓도 객체라서 새로운 정보를 저장할 수 있다.
//     }
//   });
// });

httpServer.listen(3000, handleListen);

```

> home.pug
> - 일단 다 없애고 다시 시작해봅시다
> - script(src="/socket.io/socket.io.js") 이걸 적어줘야 적용이 됩니다.소켓 아이오는 자바스크립트 기반 프레임워크니까요, 브라우저에 기본적으로 깔려있는 웹소켓 프로토콜과는 다릅니다.
```pug
doctype html
html(lang="en")
    head
        meta(charset="UTF-8")
        meta(http-equiv="X-UA-Compatible", content="IE=edge")
        meta(name="viewport", content="width=device-width, initial-scale=1.0")
        title ZoomClone
        link(rel="stylesheet",href="https://unpkg.com/mvp.css")
    body
        header
            h1 ZoomClone
        main


        script(src="/socket.io/socket.io.js")
        script(src="/public/js/app.js")


```

## 2.2 SocketIO is Amazing!
### 소켓아이오가 왜 놀라운지 알아보자

