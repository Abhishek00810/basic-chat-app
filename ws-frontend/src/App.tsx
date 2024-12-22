import { useEffect, useRef, useState } from 'react';
import './App.css'

function App()
{
  const inputRef = useRef<HTMLInputElement>(null);
  const [socket, setSocket] = useState<WebSocket>();

  function sendMessage()
  {
    if(!socket)
    {
      return;
    }
    socket.send(inputRef.current?.value || '');
  }

  useEffect(()=>{
    function data()
    {
      const ws = new WebSocket("ws://localhost:8080");
      setSocket(ws);
      ws.onmessage = (e)=>{
        alert(e.data);
      }
    }
    data();
  }, []);

  return (
    <div>
      <input ref = {inputRef} placeholder='Enter your message'></input>
      <button onClick={sendMessage}>Send</button>
    </div>
  )
}
export default App;