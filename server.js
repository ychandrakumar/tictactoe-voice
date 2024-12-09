const express = require('express')
const app= express()
const path=require("path")
const http =require('http')
const {Server }= require('socket.io');
const server=http.createServer(app)
const io=new Server(server)
// const port =3000
const port = process.env.PORT || 3001;
const fs = require('fs');

console.log(__dirname);

app.use(express.static(path.resolve("")))

let players=[];
let Game=[];

let rooms=[]

var imagedata1;


io.on('connection',(socket)=>{
    console.log('a user is connected')
    socket.on("store",(e)=>{
      socket.emit("msg","you are connected");
        console.log(e);
        const roomName = e.name; 

        console.log(roomName)
          socket.join(roomName);
        console.log(`${e.name} reached the server to set the game`);
        players.push(e.name);
    })
   
    socket.on("find",(e)=>{
      socket.emit("msg","you are connected");
        console.log(e);
        console.log(players)
        console.log(`${e.name} reached the server to find other player`);
        for(let i=0;i<players.length;i++){ 
            if(e.name==players[i]){
                console.log("came in to if condition");
                
                const roomName = e.name; 
                 const data="connected";
                const room = io.sockets.adapter.rooms.get(e.name);
                console.log("this is room",room);
                if (room && room.size < 2) {
                    console.log(roomName)
                    socket.join(roomName);
                    console.log("came in to if condition2");
                  socket.emit('joined-room', roomName);
                  io.to(roomName).emit('exclusive-event', {player:e.player, status : data});
                  console.log("message sent");

                } else {
                  socket.emit('room-full', roomName);
                  console.log("not connectd");
                }
            }
        }
    })


    socket.on("numbersent", (data) => {
       console.log(data);
        io.to(data[0]).emit('numbergot', data);
      });


      socket.on("emojisent", (data) => {
        console.log(data);
         io.to(data[0]).emit('emojigot', data);
       });

       socket.on("voiceidsent", (data) => {
       console.log("came into voididsent");
        console.log(data);
         io.to(data[0]).emit('voiceidgot', data);
       });



})


  

app.get('/',(req,res)=>{
   return res.sendFile(__dirname+'/public/index.html')
})



server.listen(port,()=>{
    console.log(`example app listening on port ${port}`)
})














