import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserGuide from './pages/userGuide'
import Home from "./pages/Home";

function App() {

  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/user-guide" component={UserGuide} />
    </Router>
  );
}

export default App;
