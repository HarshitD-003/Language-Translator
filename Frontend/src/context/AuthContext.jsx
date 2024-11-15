import { Children, createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const useAuthContext=()=>{
    return useContext(AuthContext);
}

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("chat-user")) || null
  );
  const [startGame,setStartGame]=useState(false)

  return <AuthContext.Provider value={{authUser,setAuthUser,startGame,setStartGame}}>{children}</AuthContext.Provider>;
};
