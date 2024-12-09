
import { createTicTacToeGrid, chooseBigCell, checkSmallGameOver } from './gameLogic.js';
import { generateRandomWord , createFormAndAppendToDiv} from './utils.js';
import { showGif } from './animations.js';
import { createVideoElements, createConnection,joinConnection} from './voice.js';


document.addEventListener("DOMContentLoaded", () => {



const offline = document.getElementById("btn-one");
const online = document.getElementById("btn-two");
const create = document.getElementById("create-btn");
const enter = document.getElementById("enter-btn");
const buton = document.getElementById("buton");
const gameDiv = document.querySelector(".game-div");
const grid = document.querySelector(".grid");
const smallcell = document.querySelectorAll(".smallcell");
const bigcell = document.querySelectorAll(".bigcell");
let matter = document.getElementById("text");
let onlineplay=false;
let voiceid="";
let roomname="";
const sound=new Audio("https://cdn.glitch.global/ffac02f9-918e-4b95-918b-097e09915ea5/click-button-140881.mp3?");



const socket = io();
// export { socket };
let currentPlayer = "O";
let myself="X";
let opponentself="O";
let isGameOver = false;
let showing=false;
let Aray = [true, true, true, true, true, true, true, true, true];


 
grid.addEventListener("click", (event) => {
    if (
        !isGameOver &&
        event.target.classList.contains("smallcell") &&
        !event.target.textContent &&
        myself === currentPlayer
    ) {
        sound.play();
        const cels = document.getElementsByClassName("bigcell");
        const box = document.querySelectorAll(".smallcell");
        let clickedIndex = parseInt(event.target.id, 10);

        console.log(clickedIndex);
        event.target.textContent = currentPlayer;
        let bbnum = Math.floor(clickedIndex / 9);
        let sbnum = clickedIndex % 9;
        isGameOver=checkSmallGameOver(isGameOver,bbnum,Aray,document);
        chooseBigCell(sbnum,Aray,document);

        currentPlayer = currentPlayer === "X" ? "O" : "X";
        matter.innerHTML = currentPlayer + "'s Turn";

        if (onlineplay) {
            let data = [roomname, myself, clickedIndex];
            socket.emit("numbersent", data);
            console.log(data);
        } else {
            myself = currentPlayer;
        }
    }
});

offline.addEventListener("click", () => {
    console.log("offline button clicked ...................");
    online.style.display = "none";
    offline.style.display = "none";
    createTicTacToeGrid(grid);
    matter.innerHTML = currentPlayer + "'s Turn";
});

  
  create.addEventListener("click", () => {
    document.getElementById("buton").style.display = "none";
    const randomWord = generateRandomWord();
   currentPlayer="X";
    socket.emit("store", { name: randomWord });
  
    let xyz = document.createElement("p");
    xyz.id="codename";
  
    let msg = document.createElement("p");
    msg.id="msgname";
    xyz.innerHTML = randomWord;
    roomname=randomWord;
    msg.innerHTML = "ask your friend to enter this code to offline together";
  
    document.getElementsByClassName("start-div")[0].appendChild(xyz);
    document.getElementsByClassName("start-div")[0].appendChild(msg);
  });
  
  
  
  enter.addEventListener("click", () => {
    document.getElementById("buton").style.display = "none";
    createFormAndAppendToDiv(document);
    const Submitbutton=document.getElementById("submitBtn");
    Submitbutton.classList.add("btn");
    myself="O";
    opponentself="X";
  
    Submitbutton.addEventListener("click",()=>{
      Submitbutton.disabled = true;
      console.log("submitted");
      const plywrd=document.getElementById("alphabets").value;
      roomname=plywrd;
      socket.emit("find", { player: "X" , name: plywrd });
      // socket.emit('join-room', plywrd); 
      
    })
    document.getElementById("alphabets").addEventListener("keypress", function (e) {
        // Prevent further input beyond 4 characters
        if (this.value.length >= 4) {
          e.preventDefault();
        }
      });
  });
  
  
  
  
  online.addEventListener("click", () => {
     
    offline.style.display = "none";
    online.style.display = "none";

    create.style.display = "block";
    enter.style.display = "block";
    
  });


  for(let i=101;i<105;i++){
    document.getElementById(i).addEventListener("click",(evnt)=>{
        let data=[roomname,i];
        console.log(data);
        socket.emit("emojisent", data);
      
    })}





    document.getElementById("info-button").addEventListener('click', ()=>{
        console.log('clicked');
        if(!showing){
          showing=true;
          console.log("this is also running");
          document.getElementById("info-tooltip").style.display='block';
          const elements = document.getElementsByClassName('extras');
          for (let i = 0; i < elements.length; i++) {
            elements[i].style.display = 'inline'; 
          }
        }
        else{
          showing=false;
          console.log("this is also running");
        document.getElementById("info-tooltip").style.display='none';
       const elements = document.getElementsByClassName('extras');
       for (let i = 0; i < elements.length; i++) {
           elements[i].style.display = 'none'; 
       }
      }
       
      })

       

socket.on('exclusive-event', (data) => {
   
  console.log('Received exclusive-event:', data);
  if(data.status==="connected"){
    document.getElementById('info-button').style.display="block";
    // buton.style.display="none";
    const dam=document.getElementById("myForm");
    if(dam!==null){
      dam.style.display="none";
    }
    const dam1=document.getElementById("codename");
    if(dam1!==null){
      dam1.style.display="none";
    }
    const dam2=document.getElementById("msgname");
    if(dam2!==null){
      dam2.style.display="none";
    }
     onlineplay=true;
     createVideoElements();
     if(currentPlayer=="X"){

      createConnection().then((vd) => {
        voiceid=vd;
        console.log(vd); // This will print the resolved value
     if(currentPlayer=="O") otherplayer="X"; 
     socket.emit("voiceidsent", [roomname, "O",voiceid]);
    
      });

      
      console.log(voiceid+" this is voicid");
     }
     createTicTacToeGrid(grid);
      matter.innerHTML = currentPlayer + "'s Turn";
      
    
     
    
  }
});



socket.on('numbergot', (data) => {
  console.log(data.length+" this is debug code in number scoket"+data);
  if(data.length!=2){
    if(data[1]===opponentself){
      let bestMove=data[2];
      // console.log(bestMove)
      console.log(document.getElementById(data[2])+"thsi is the box. about to place the oponnt self");
      document.getElementById(data[2]).textContent=opponentself;
      sound.play();
      currentPlayer=myself;
      matter.innerHTML = currentPlayer + "'s  Turn";
    
      // console.log(data[2]);
      var num=Math.floor(bestMove/9);
      checkSmallGameOver(isGameOver,num,Aray,document)
      // checksbgameover(Math.floor(bestMove/9));
      console.log("chosbigcell si goint to run");
      chooseBigCell(bestMove%9,Aray,document);
     
    }
  }

});



socket.on("emojigot",  (data) => {
  // console.log("apple", data);
  console.log(data.length+" this is debug code is emoji sokcet "+ data);
  if(data.length==2){

    showGif(data[1],document);
  }
});



socket.on("voiceidgot",  (data) => {
  console.log(data.length+" this is debug code is voiceidgot sokcet "+ data);
  
  if(data[1]==currentPlayer){
    console.log("cmae into if statre of join connection");
    // joinConnection(data[2]);
    joinConnection(data[2])
    .then(() => {
        console.log("Connection joined successfully.");
    })
    .catch((error) => {
        console.error("Error joining connection: ", error);
    });
    
  }
});



    });//document loaded listener
 



