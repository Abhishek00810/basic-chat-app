import { useEffect, useRef, useState } from 'react';
import './App.css'

function App()
{
  interface ValProps{
    type: string, // join, chat
    payload:{
      roomId?:string,
      message?:string | undefined
    }
  }
  interface MessageProps{
    type: string,
    message: string
  }
  const inputRef = useRef<HTMLInputElement>(null);
  const RoomRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<MessageProps[]>([]);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState<WebSocket>();

  function JoinSession()
  {
    const Data:ValProps  = {
      type: "join",
      payload:{
        roomId: RoomRef.current?.value
      }
    }
    socket?.send(JSON.stringify(Data));
    alert("Joined")
  }

  function sendMessage()
  {
    const Data:ValProps  = {
      type: "chat",
      payload:{
        message: inputRef.current?.value
      }
    }
    if(!socket)
    {
      return;
    }
    socket.send(JSON.stringify(Data));

    const str: MessageProps = {
      message: inputRef.current?.value || '',
      type: "user"
    }
    if(inputRef.current?.value)
    {
      inputRef.current.value = "";
    }
    
    setMessage([...message, str])
  }
  
  const MESSAGE_CALL = () => {
    console.log(message.length)
    return message.map((msg, i) => (
      <div className={`text-right`} key={i}>
        <h1 className= {`${msg.type == "user" ? `bg-blue-200 inline-block` : `bg-white`} rounded-xl p-4 w-fit m-4`}>
          {msg.message}
        </h1>
      </div>
    ));
  };
  

  useEffect(()=>{
    const a1: MessageProps = {
      message: "This is my chat",
      type: "user"
    }

    setMessage([...message, a1]);
    function data()
    {
      const ws = new WebSocket("ws://localhost:8080");
      setSocket(ws);
      ws.onmessage = (e)=>{
        const Data: MessageProps = {
          message: e.data,
          type: "server"
        }
        setMessage((prevMessages) => [...prevMessages, Data]);
      }
    }
    data();
  }, []);

  return (
    <div className='h-screen flex flex-col'>
      <div className='bg-blue-400 py-4'>
        <h1 className='text-white px-6'>Chat Application</h1>
      </div>
      <div className='flex-1 bg-gray-200 p-4 overflow-y-auto text-right'>
        <input ref = {RoomRef} className='rounded-md px-2 m-4 focus:outline-none' placeholder='RoomId'></input>
        <button className='bg-blue-400 px-4 rounded-md text-white' onClick={JoinSession}>Join</button>
        {MESSAGE_CALL()}
        <div ref={endOfMessagesRef}></div>
      </div>
      <div className='flex-shrink-0 flex overflow-hidden my-4 bg-white p-2 border-t'>
      
      <input className='flex-1 rounded-xl px-4 border-4 border-blue-200 focus:outline-none' ref = {inputRef} placeholder='Enter your message...'></input>
      <button className='p-4 px-8 bg-blue-400 text-white font-bold rounded-xl ' onClick={sendMessage}>Send</button>
      </div>

    </div>
  )
}
export default App;