import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Translate from './components/Translate';
import ParticlesBackground from './components/ParticlesBackground'; // Import ParticlesBackground
import './index.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import History from './components/History';
import Game from './components/Game';
import { useAuthContext } from './context/AuthContext';
import Home from './components/Home';
import Stats from './components/Stats';
import Resources from './components/Resources'; // Import Resources component
import Profile from './components/Profile';

function App() {
    const { setAuthUser } = useAuthContext();
    const { authUser } = useAuthContext();

    const handleLogin = (username, password) => {
        const user1 = 'krishna';
        const pass1 = 'asdf';
        const user2 = 'yash';
        const pass2 = 'qwer';
        const user3 = 'harshit';
        const pass3 = '1234';
        if (
            (username === user1 && password === pass1) ||
            (username === user2 && password === pass2) ||
            (username === user3 && password === pass3)
        ) {
            localStorage.setItem(
                'chat-user',
                JSON.stringify({ username, password })
            );
            setAuthUser({ username, password });
        } else {
            alert('wrong credentials');
        }
    };

    return (
        <>
            {/* Render the ParticlesBackground outside of the Router */}
            <ParticlesBackground />
            <div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    color: 'white',
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Routes>
                    {/* Login Route */}
                    <Route
                        path="/"
                        element={
                            authUser ? (
                                <Navigate to="/home" />
                            ) : (
                                <Login onLogin={handleLogin} />
                            )
                        }
                    />

                    {/* Authenticated Routes */}
                    <Route
                        path="/home"
                        element={authUser ? <Home /> : <Navigate to="/" />}
                    />
                    <Route
                        path="/signup"
                        element={
                            !authUser ? <SignUp /> : <Navigate to="/home" />
                        }
                    />
                    <Route
                        path="/translate"
                        element={authUser ? <Translate /> : <Navigate to="/" />}
                    />
                    <Route
                        path="/game"
                        element={authUser ? <Game /> : <Navigate to="/" />}
                    />
                    <Route
                        path="/history"
                        element={authUser ? <History /> : <Navigate to="/" />}
                    />
                    <Route
                        path="/stats"
                        element={authUser ? <Stats /> : <Navigate to="/" />}
                    />
                    <Route
                        path="/profile"
                        element={authUser ? <Profile /> : <Navigate to="/" />}
                    />

                    {/* Resources Page */}
                    <Route
                        path="/resources"
                        element={authUser ? <Resources /> : <Navigate to="/" />}
                    />
                </Routes>
            </div>
        </>
    );
}

export default App;
