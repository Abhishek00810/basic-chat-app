"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let Allsockets = [];
wss.on('connection', function (socket) {
    console.log("User connected");
    socket.on("message", function (message) {
        const messageString = message.toString();
        const messageParse = JSON.parse(messageString);
        if (messageParse.type == "join") {
            Allsockets.push({
                socket: socket,
                roomId: messageParse.payload.roomId
            });
        }
        else {
            let roomId_final = "";
            console.log(Allsockets.length);
            for (let i = 0; i < Allsockets.length; i++) {
                console.log("HEYT");
                if (Allsockets[i].socket === socket) {
                    roomId_final = Allsockets[i].roomId;
                }
            }
            for (let i = 0; i < Allsockets.length; i++) {
                if (roomId_final == Allsockets[i].roomId) {
                    Allsockets[i].socket.send(messageParse.payload.message);
                }
            }
        }
    });
});
