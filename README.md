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
  app.set("views", __dirname +"/views");
  app.use("/public", express.static(__dirname + "/public"));
  app.get("/", (req,res) => res.render("home"));
  
  const handleListen = () => console.log(`Listening on http://localhost:3000`)
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
  app.set("views", __dirname +"/views");
  app.use("/public", express.static(__dirname + "/public"));
  app.get("/", (req,res) => res.render("home"));
  app.get("/*", (req,res) => res.redirect("/"));
  const handleListen = () => console.log(`Listening on http://localhost:3000`)
  app.listen(3000, handleListen);
  ```
---


# 1 CHAT WITH WEBSOCKET
## 1.0 Introduction
### 실시간 채팅 앱을 만들어보자
> 구현 기능
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
```
