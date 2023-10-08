
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Chat from './pages/Chat';
import { chatContext } from './context/chatProvider';
import { useContext } from 'react';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
//import { ChatState } from './context/chatProvider';

function App() {
  const { user, setUser } = useContext(chatContext);
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={(!user) ? <Home /> : <Chat />} />
        <Route path='/chats' element={(!user) ? <Home /> : <Chat />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
