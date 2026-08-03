import app from "./app";
import { createServer } from "http";
import { Server } from "socket.io";

import {
  initializeSocket
} from "./socket/socket";


const httpServer = createServer(app);


const io = new Server(
  httpServer,
  {
    cors:{
      origin:"http://localhost:5173",
      credentials:true,
    },
  }
);


initializeSocket(io);



httpServer.listen(
  5000,
  ()=>{
    console.log(
      "Server running on 5000"
    );
    
  }
);