import { HashRouter, Route, Routes } from 'react-router-dom';
import UserGuide from './pages/userGuide'
import MainBoard from './components/MainBoard';
import Landing from './components/Landing';
import Navbar from './components/Navbar';

function App() {

  // basename is '/' when the home page is rigged up to a custom domain
  // (e.g. atlasapprox.org). If using the default GitHub pages URL, the
  // URL is https://fabilab.github.io/cell_atlas_approximations_HI,
  // therefore the basename should be '/cell_atlas_approximations_HI/'
  // It's a little annoying to have to switch that statically here.
  return (
    <HashRouter basename='/'>
      <div>
        <Navbar/>
        <Routes>
          <Route exact path="/" element={<Landing/>} />
          <Route path="/mainboard" element={<MainBoard/>}/>
          <Route path="/user-guide" element={<UserGuide/>} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
