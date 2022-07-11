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
- server.json
  - 시험용 서버

  ```json
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

## 0.4
개발 환경 세팅을 했음
