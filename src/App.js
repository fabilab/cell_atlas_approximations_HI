import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserGuide from './pages/userGuide'
import Home from "./pages/Home";
import MainBoard from './components/MainBoard';
import Landing from './components/Landing';
import Navbar from './components/Navbar';

function App() {

  return (
    <Router>
      <div>
        <Navbar/>
        <Route path="/" exact component={Landing} />
        <Route path="/mainboard" component={MainBoard}/>
        <Route path="/user-guide" component={UserGuide} />
      </div>
    </Router>
  );
}

export default App;
