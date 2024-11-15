import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Translate from './components/Translate';
import ParticlesBackground from './components/ParticlesBackground';  // Import ParticlesBackground
import './index.css';
import History from './components/History';


function App() {
  return (
    <>
      {/* Render the ParticlesBackground outside of the Router */}
      <ParticlesBackground />

      {/* Main content should be above particles */}
      <div style={{ position: 'relative', zIndex: 1, color: 'white', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/translate" element={<Translate />} />
            <Route path='/history' element={<History />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
