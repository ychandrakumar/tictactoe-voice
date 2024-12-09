// Import Firebase modules (make sure to use the ES module version)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js';
import { getFirestore, collection, doc, addDoc, getDoc, onSnapshot, updateDoc, setDoc } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMdzPP6YZPwxVYlyIXJmn8Bpv1boEK4zY",
  authDomain: "tictactoe-79830.firebaseapp.com",
  projectId: "tictactoe-79830",
  storageBucket: "tictactoe-79830.firebasestorage.app",
  messagingSenderId: "222911308322",
  appId: "1:222911308322:web:e3c940f8a6675880f4a07b",
  measurementId: "G-Q2QHVM61GK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

// Global State
const pc = new RTCPeerConnection(servers);
let localStream = null;
let remoteStream = null;

// HTML elements
const webcamButton = document.getElementById('webcamButton');
const webcamVideo = document.getElementById('webcamVideo');
const callButton = document.getElementById('callButton');
const callInput = document.getElementById('callInput');
const answerButton = document.getElementById('answerButton');
const remoteVideo = document.getElementById('remoteVideo');
const hangupButton = document.getElementById('hangupButton');

let isLocalMuted = false; // Track local mute state
let isRemoteMuted = false; // Track remote mute state

// 1. Create connection and send offer
export async function createConnection() {
    const webcamVideo = document.getElementById('webcamVideo');
    const remoteVideo = document.getElementById('remoteVideo');
    const callInput = document.getElementById('callInput');
  // Setup media sources and start webcam
  localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  remoteStream = new MediaStream();

  localStream.getTracks().forEach((track) => {
    pc.addTrack(track, localStream);
  });

  pc.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  webcamVideo.srcObject = localStream;
  remoteVideo.srcObject = remoteStream;

//   callButton.disabled = false;
//   answerButton.disabled = false;
//   webcamButton.disabled = true;

  // Firebase signaling
  const callDoc = doc(collection(firestore, 'calls'));
  const offerCandidates = collection(callDoc, 'offerCandidates');
  const answerCandidates = collection(callDoc, 'answerCandidates');


//   callInput.value = callDoc.id;
//   console.log("calll input id dass"+ callInput);


  pc.onicecandidate = (event) => {
    if (event.candidate) {
      addDoc(offerCandidates, event.candidate.toJSON());
    }
  };

  const offerDescription = await pc.createOffer();
  await pc.setLocalDescription(offerDescription);

  const offer = {
    sdp: offerDescription.sdp,
    type: offerDescription.type,
  };

  await setDoc(callDoc, { offer });

  // Listen for remote answer
  onSnapshot(callDoc, (snapshot) => {
    const data = snapshot.data();
    if (!pc.currentRemoteDescription && data?.answer) {
      const answerDescription = new RTCSessionDescription(data.answer);
      pc.setRemoteDescription(answerDescription);
    }
  });

  // When answered, add candidate to peer connection
  onSnapshot(answerCandidates, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const candidate = new RTCIceCandidate(change.doc.data());
        pc.addIceCandidate(candidate);
      }
    });
  });

//   hangupButton.disabled = false;

  return callDoc.id; // Return the unique ID
}

// 2. Join connection using the provided unique ID
export async function joinConnection(callId) {
    console.log("came into join funtion "+callId);
  // Firebase signaling
  const remoteStreamVideo = document.createElement("video");
  const callDoc = doc(firestore, 'calls', callId);
  const answerCandidates = collection(callDoc, 'answerCandidates');
  const offerCandidates = collection(callDoc, 'offerCandidates');

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      addDoc(answerCandidates, event.candidate.toJSON());
    }
  };

  const callData = (await getDoc(callDoc)).data();
  const offerDescription = callData.offer;
  await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

  const answerDescription = await pc.createAnswer();
  await pc.setLocalDescription(answerDescription);

  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
  };

  await updateDoc(callDoc, { answer });

  onSnapshot(offerCandidates, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        let data = change.doc.data();
        pc.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });

//   hangupButton.disabled = false;
}


export function createVideoElements() {


    const localStreamVideo = document.createElement("video");
    localStreamVideo.id = "webcamVideo";
    localStreamVideo.setAttribute("playsinline", "");
  
    const remoteStreamVideo = document.createElement("video");
    remoteStreamVideo.id = "remoteVideo";
    remoteStreamVideo.setAttribute("playsinline", "");
  
    
    document.body.appendChild(localStreamVideo);
    document.body.appendChild(remoteStreamVideo);
    console.log("came into the funtion");
    //----------------------------------------------------

    const muteButton = document.createElement("button");
  muteButton.id = "muteButton";
  
  const muteIcon = document.createElement("img");
  muteIcon.src = "./mic.svg";
  
  muteButton.appendChild(muteIcon);

  const muteRemoteButton = document.createElement("button");
  muteRemoteButton.id = "muteRemoteButton";
  
  const muteRemoteIcon = document.createElement("img");
  muteRemoteIcon.src = "./aud.svg";
  muteRemoteButton.appendChild(muteRemoteIcon);
  
  document.body.appendChild(muteButton);
  document.body.appendChild(muteRemoteButton);
  }
  