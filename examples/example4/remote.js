import ServiceFirestore from "https://cdn.jsdelivr.net/gh/GabrielSessions/firestore-js/v0.4/index.js";

const firebaseConfig = {
  apiKey: "AIzaSyAeA46AruGxkzOV_JzMt1dTwXEXGx-oqsw",
  authDomain: "en1-2022.firebaseapp.com",
  projectId: "en1-2022",
  storageBucket: "en1-2022.appspot.com",
  messagingSenderId: "676418109071",
  appId: "1:676418109071:web:88590003872f2565303afa",
  measurementId: "G-K5H1D2PWW6"
};
  
const db = new ServiceFirestore(firebaseConfig, "pyrepl-examples")
const robot1Id = "example4";

const forwardButton = document.getElementById("forward");
forwardButton.addEventListener("click", function() {
    db.updateDocument({movement: ""}, robot1Id);
    db.updateDocument({movement: "forward"}, robot1Id);
});

const backwardButton = document.getElementById("backward");
backwardButton.addEventListener("click", function() {
    db.updateDocument({movement: ""}, robot1Id);
    db.updateDocument({movement: "backward"}, robot1Id);
});

const stopButton = document.getElementById("stop");
stopButton.addEventListener("click", function() {
    db.updateDocument({movement: "stop"}, robot1Id);
});

const leftButton = document.getElementById("left");
leftButton.addEventListener("click", function() {
    db.updateDocument({movement: ""}, robot1Id);
    db.updateDocument({movement: "left"}, robot1Id);
});

const rightButton = document.getElementById("right");
rightButton.addEventListener("click", function() {
    db.updateDocument({movement: ""}, robot1Id);
    db.updateDocument({movement: "right"}, robot1Id);
});
