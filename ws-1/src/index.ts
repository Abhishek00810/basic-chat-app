import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({port: 8080});

interface socketProps{
    socket: WebSocket,
    roomId: string
}

let Allsockets:socketProps[] = [];

wss.on('connection', function(socket){
    console.log("User connected");

    socket.on("message", function(message){
        const messageString = message.toString();
        const messageParse = JSON.parse(messageString)
        if(messageParse.type == "join")
        {
            Allsockets.push({
                socket: socket,
                roomId: messageParse.payload.roomId
            })
        }
        else{
            let roomId_final:string = "";
            for(let i = 0;i<Allsockets.length;i++)
            {
                if(Allsockets[i].socket === socket)
                {
                    roomId_final = Allsockets[i].roomId;
                }
            }
            for(let i = 0;i<Allsockets.length;i++)
            {
                if(roomId_final == Allsockets[i].roomId)
                {
                    Allsockets[i].socket.send(messageParse.payload.message);
                }
            }
        }
    })
})