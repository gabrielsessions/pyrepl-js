import ServiceFirestore from "https://cdn.jsdelivr.net/gh/GabrielSessions/firestore-js/v0.4/index.js";

const stopMotor = 
`import motor, port
motor.motor_stop()`;

const moveForward = 
`import motor, port
motor.motor_move_for_time(port.PORTA, 1000, 5000)
motor.motor_move_for_time(port.PORTB, 1000, -5000)`;

const moveBackward = 
`import motor, port
motor.motor_move_for_time(port.PORTA, 1000, -5000)
motor.motor_move_for_time(port.PORTB, 1000, 5000)`;

const moveLeft = 
`import motor, port
motor.motor_move_for_time(port.PORTB, 500, 5000)`;

const moveRight = 
`import motor
motor.motor_move_for_time(port.PORTA, 500, 5000)`;

    
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

const actionId = "example4";

const onChange = (doc) => {
    console.log(doc)
    switch(doc.movement) {
        case "forward":
            window.pyrepl.write = moveForward;
            break;
        case "backward":
            window.pyrepl.write = moveBackward;
            break;
        case "stop":
            window.pyrepl.write = stopMotor;
            break;
        case "left":
            window.pyrepl.write = moveLeft;
            break;
        case "right":
            window.pyrepl.write = moveRight;
        default:
            break; 
    }
}

const unsub = db.listenToDocument(actionId, onChange);
  