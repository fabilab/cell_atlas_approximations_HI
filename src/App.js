import { HashRouter, Route } from 'react-router-dom';
import UserGuide from './pages/userGuide'
import MainBoard from './components/MainBoard';
import Landing from './components/Landing';
import Navbar from './components/Navbar';
import { Switch } from 'react-router-dom';

function App() {

  return (
    <HashRouter>
      <div>
        <Navbar/>
        <Switch>
          <Route path="/" exact component={Landing} />
          <Route path="/mainboard" component={MainBoard}/>
          <Route path="/user-guide" component={UserGuide} />
        </Switch>
      </div>
    </HashRouter>
  );
}

export default App;
