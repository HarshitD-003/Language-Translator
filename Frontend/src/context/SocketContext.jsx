import { createContext, useContext, useEffect, useState } from "react";
// import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";
import { useAuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState();
  const { authUser } = useAuthContext();
  const { startGame } = useAuthContext();

  useEffect(() => {
    if (authUser && startGame) {
      const socket = io("http://localhost:8001");
      setSocket(socket);
      // console.log("start");

      socket.on("connect", () => {
        console.log("Connected to server:", socket.id);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from server");
      });
      // console.log(socket);

      return () => socket.close();
    }
  }, [authUser,startGame]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
