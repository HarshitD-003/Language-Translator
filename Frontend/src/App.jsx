import React, { useState } from "react";
import { Routes, Route, Navigate, useActionData } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Translate from "./components/Translate";
import ParticlesBackground from "./components/ParticlesBackground";
import Game from "./components/Game";
import { useAuthContext } from "./context/AuthContext";

function App() {
  // const [authUser, setauthUser] = useState(false);
  const {setAuthUser} = useAuthContext()
  const {authUser} = useAuthContext()

  const handleLogin = (username, password) => {
    const user1 = "krishna";
    const pass1 = "asdf";
    const user2 = "yash";
    const pass2 = "qwer";
    if (
      (username === user1 && password === pass1) ||
      (username === user2 && password === pass2)
    ) {
      localStorage.setItem("chat-user", JSON.stringify({ username, password }));
      setAuthUser({ username, password });
      // setauthUser(true);
    } else {
      alert("wrong credentials");
      // setauthUser(false);
    }
  };

  return (
    <>
      {/* Render the ParticlesBackground outside of the Router */}
      <ParticlesBackground />

      {/* Main content should be above particles */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          color: "white",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              authUser ? (
                <Navigate to="/translate" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected routes: only accessible if logged in */}
          <Route
            path="/translate"
            element={authUser ? <Translate /> : <Navigate to="/" />}
          />
          <Route
            path="/game"
            element={authUser ? <Game /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
