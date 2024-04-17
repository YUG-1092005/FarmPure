import {io} from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";

let input = document.getElementById("messageInput");
let form = document.getElementById("chatForm");
let ul = document.getElementById("box");
let userId = document.getElementById("userId").value;
let btn = document.getElementById("send-btn");

const socket = io("http://localhost:3000");


btn.addEventListener("click", () => {
    const pathParts = window.location.pathname.split('/'); //taking url from window
    console.log("Path parts: ", pathParts);
    const expertId = pathParts[2]; 
    console.log("Expert ID: ", expertId);

    socket.emit("start-chat", expertId , userId); //starting chat message
});


socket.on("connect", () => {
    console.log("userId: " , userId);
    socket.emit('authenticate', userId);

    form.addEventListener("submit" , (event) => {
        event.preventDefault();
        let message = input.value;
        if(message) {
            console.log(message);
            displayMessage(message);
            const pathParts = window.location.pathname.split('/');
            const expertId = pathParts[2];
            socket.emit("send-msg", { message, expertId , userId});
            input.value = "";
        }else {
           console.log("Enter correct value");
        }
    });

});

socket.on("receive-msg", (message) => {
    displayIncomingMessage(message);
});

// Function to display an outgoing message in the UI
function displayMessage(message) {
    let li = document.createElement("li")
    li.classList.add("chat")
    li.classList.add("outgoing")
    let p = document.createElement("p");
    p.innerText = message;
    li.append(p);
    ul.append(li);
}

// Function to display an incoming message in the UI
function displayIncomingMessage(message) {
    let li = document.createElement("li");
    li.classList.add("chat");
    li.classList.add("incoming");
    let p = document.createElement("p");
    p.innerText = message;
    li.append(p);
    ul.append(li);
}







