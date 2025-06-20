import { useState } from 'react'
import './App.css'
import SocketClient from './Components/socketclient'
import AllRooms from './Components/allrooms';

function App() {
  return (
    <div>
      <AllRooms />
    </div>
  );
}

export default App
