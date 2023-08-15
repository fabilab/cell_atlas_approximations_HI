import { HashRouter, Route, Routes } from 'react-router-dom';
import UserGuide from './pages/userGuide'
import Home from "./pages/Home";
import MainBoard from './components/MainBoard';
import Landing from './components/Landing';
import Navbar from './components/Navbar';

function App() {

  return (
    <HashRouter>
      <div>
        <Navbar/>
        <Routes>
          <Route path="/" exact component={Landing} />
          <Route path="/mainboard" component={MainBoard}/>
          <Route path="/user-guide" component={UserGuide} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
