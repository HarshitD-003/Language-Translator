// import { createContext, useContext, useEffect, useState } from "react";
// // import { useAuthContext } from "./AuthContext";
// import io from "socket.io-client"


// export const SocketContext=createContext();

// export const useSocketContext=()=>{
//     return useContext(SocketContext);
// }


// export const SocketContextProvider=({children})=>{
//     const [socket,setSocket]=useState();
//     // const [onlineUser,setOnlineUser]=useState([])
//     // const {authUser}=useAuthContext();

//     useEffect(()=>{
//         // if(authUser){
//             const socket=io("http://localhost:8000"
//                 // , {
//                 //     transports: ["websocket"],
//                 // }
//             );
//             setSocket(socket);
            
//             // socket.on('getOnlineUsers',(users)=>{
//             //     console.log("online");
//             //        setOnlineUser(users); 
//             // })

//             return ()=>socket.close();
//         // } else{
//         //     if(socket){
//         //         socket.close();
//         //         setSocket(null);
//         //     }
//         // }
//     },[])

//     return <SocketContext.Provider value={{socket}}>{children}</SocketContext.Provider>
// }