const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 7071 });
   

class MyWebSocket {
   constructor(){
      wss.on('connection', (ws) => {
         console.log('New client connected!'); 
         ws.on('close', () => console.log('Client has disconnected!'));
      });
   }
   
   sendMessageAll(objMensagem){
      wss.clients.forEach((client) => {
         const data = JSON.stringify(objMensagem);
         client.send(data);
      });
   }
   
} 

class Singleton {

   constructor() {
       if (!Singleton.instance) {
           Singleton.instance = new MyWebSocket();
       }
   }
 
   getInstance() {
       return Singleton.instance;
   }
}
module.exports =  Singleton;

