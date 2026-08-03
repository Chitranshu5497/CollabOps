import { useEffect } from "react";
import { socket } from "../socket/socket";
import { useAuthStore } from "../store/auth.store";


const useSocket = () => {


useEffect(()=>{


 socket.connect();
const user = useAuthStore.getState().user;

if (user) {
  socket.emit(
    "register-user",
    user.id
  );
}

 socket.on(
   "connect",
   ()=>{
    console.log(
      "Socket connected:",
      socket.id
    );
   }
 );


 return ()=>{

   socket.disconnect();

 };


},[]);


};


export default useSocket;