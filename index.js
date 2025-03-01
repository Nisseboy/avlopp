const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" }});

const {readdir} = require('node:fs/promises');



require("./ndv");

require("./public/constants");

require("./public/entities/EntityBase");
require("./public/entities/EntityPlayer");
require("./public/entities//EntityItem");

require("./public/objects/ObjectBase");
require("./public/objects/ObjectText");
require("./public/objects/ObjectTexture");
require("./public/objects/ObjectWater");
require("./public/objects/ObjectTextureLight");

require("./public/Room");
require("./public/world");

require("./public/prefabs");




async function start() {
  const assets = await readdir('./public/assets', { recursive: true });
  

  let lobbies = {}

  app.use(express.static('public'));
  
  app.get("/*", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
  });
  
  let p = process.env.PORT || constants.port;
  server.listen(p, () =>{
      console.log("http://127.0.0.1:" + p + "/");
  });
  
  
  io.on("connection", (socket) => {
    let lobby;
    let player;
  
    socket.on("join", (data) => {
      if (data.lobby != parseFloat(data.lobby)) return;
  
      lobby = lobbies[data.lobby];
      if (lobby == undefined) {
        lobby = createLobby(data.lobby);
      }
  
      player = new EntityPlayer(lobby.world.size._div(2), "EntityPlayer");
      lobby.world.entities.push(player);
  
      socket.emit("join", {
        world: lobby.world,
        id: player.id,
        assets: assets,
      });
      emitOthers({id: player.id, action: "connect", player: player});
  
      lobby.sockets[player.id] = socket;
      lobby.events[player.id] = [];
  
      console.log(`${lobby.lobbyId}: ${player.id} Connected`);
    });
  
    socket.on('disconnect', () => {
      if (!lobby || !player) return;
      lobby.world.entities.splice(lobby.world.entities.indexOf(player), 1);
  
      emitOthers({id: player.id, action: "disconnect"});
  
      delete lobby.sockets[player.id];
  
      console.log(`${lobby.lobbyId}: ${player.id} Disconnected`);
    });
  
    socket.on('event', dataAll => {
      if (!lobby || !player) return;
  
      let world = lobby.world;
  
      for (let data of dataAll.events) {
        
      
        switch(data.action) {
          case "move":
            player.pos = data.pos;
            break;
          case "update slots":
            player.slots = data.slots;
            player.slot = data.slot;
            break;
  
          case "create entity":
            let e = cloneEntity(data.entity);
        
            world.entities.push(e);
            break;
  
  
          case "vec":
            world.entities.find(e => e.id == data.entityId)[data.path] = data.vec;
            break;
          case "primitive":
            world.entities.find(e => e.id == data.entityId)[data.path] = data.primitive;
            break;
          case "remove entity":
            let index = world.entities.findIndex(e=>e.id==data.entityId);
            if (index == -1) continue;
  
            world.entities.splice(index, 1);
            break;
        }
        
        data.id = dataAll.id;
        emitOthers(data);
      }
    });
  
    function emitOthers( data) {
      if (!lobby || !player) return;
  
      for (let id in lobby.sockets) {
        if (player.id == id) continue;
  
        lobby.events[id].push(data);
      }
    }
  });
  
  
  function createLobby(lobbyId) {
    let lobby = {
      lobbyId: lobbyId,
      world: new World().random(),
      sockets: {},
      events: {},
    };
  
    let interval = setInterval(() => {
      if (Object.keys(lobby.sockets).length == 0) {
        clearInterval(interval);
        delete lobbies[lobbyId];
        console.log(`${lobbyId}: Lobby deleted`);
      }
  
      for (let id in lobby.sockets) {
        let s = lobby.sockets[id];
        let e = lobby.events[id];
  
        if (e == undefined) continue;
  
        s.emit("update", {events: e});
  
        e.length = 0;
      }
    }, constants.updateInterval);
  
    lobbies[lobbyId] = lobby;
  
    console.log(`${lobbyId}: Lobby created`);
    return lobby;
  }
}
start();

