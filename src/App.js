import { HashRouter, Route, Routes } from 'react-router-dom';
import UserGuide from './pages/userGuide'
import MainBoard from './components/MainBoard';
import Landing from './components/Landing';
import Navbar from './components/Navbar';

function App() {

  return (
    <HashRouter>
      <div>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/mainboard" element={<MainBoard/>}/>
          <Route path="/user-guide" element={<UserGuide/>} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
