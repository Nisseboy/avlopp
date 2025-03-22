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

require("./public/Material");
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

    socket.on("create lobby", data => {
      let code;
      let mult = 10000;
      let tries = 0;
      while (true) {
        code = Math.floor(Math.random() * mult);
        if (lobbies[code]) {
          tries++;
          if (tries == 100) {
            tries = 0;
            mult *= 10;
          }
          continue;
        }

        break;
      }

      data.lobby = code;

      let lobby = createLobby(data);
      
      socket.emit("create lobby", {
        lobbyId: lobby.lobbyId,
      });            
    });

    socket.on("get lobbies", data => {
      let foundLobbies = [];
      for (let i in lobbies) {
        let lobby = lobbies[i];      
        if (!lobby.public) continue;

        let playerCount = Object.keys(lobby.sockets).length;
        if (playerCount == lobby.maxPlayers) continue;

        foundLobbies.push({lobbyId: lobby.lobbyId, playerCount: playerCount, maxPlayers: lobby.maxPlayers});
      }

      foundLobbies.sort((a,b)=>{return b.playerCount - a.playerCount});
      
      socket.emit("get lobbies", {
        lobbies: foundLobbies,
      });            
    });
  
    socket.on("join", (data) => {
      if (data.lobby != parseFloat(data.lobby)) return;
  
      lobby = lobbies[data.lobby];
      if (lobby == undefined) {
        socket.emit("exit", {
          reason: "No lobby exists with that code",
        });
        return;
      }
      if (Object.keys(lobby.sockets).length >= lobby.maxPlayers) {
        socket.emit("exit", {
          reason: "Lobby full",
        });
        return;
      }
  
      player = new EntityPlayer(lobby.world.size._div(2), "EntityPlayer");
      player.pos.from(lobby.world.entities[0].pos);

      if (data.id && lobby.offlinePlayers[data.id]) {
        player = lobby.offlinePlayers[data.id];
        delete lobby.offlinePlayers[data.id];        
      }

      player.displayName = data.name;
      player.color = new Vec().from(data.color);

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
      
      lobby.offlinePlayers[player.id] = player;  

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
  
  
  function createLobby(data) {
    let lobby = {
      lobbyId: data.lobby,
      public: data.public,
      maxPlayers: data.maxPlayers,

      world: new World().random(),
      sockets: {},
      events: {},
      offlinePlayers: {},
      offlineTime: 0,
    };
  
    let interval = setInterval(() => {
      if (Object.keys(lobby.sockets).length == 0) {
        if (lobby.offlineTime >= constants.lobbyDeleteTime && !data.infinite) {
          clearInterval(interval);
          delete lobbies[lobby.lobbyId];
          console.log(`${lobby.lobbyId}: Lobby deleted`);
          return;
        } else {
          lobby.offlineTime += constants.updateInterval;
        }
      } else {
        lobby.offlineTime = 0;
      }

      
  
      for (let id in lobby.sockets) {
        let s = lobby.sockets[id];
        let e = lobby.events[id];
  
        if (e == undefined) continue;
  
        s.emit("update", {events: e});
  
        e.length = 0;
      }
    }, constants.updateInterval);
  
    lobbies[lobby.lobbyId] = lobby;
  
    console.log(`${lobby.lobbyId}: Lobby created`);
    return lobby;
  }

  /*for (let i = 0; i < 10; i++) {
    createLobby({lobby: i, public: Math.random() < 0.5, maxPlayers: 8});
  }*/
 
  createLobby({lobby: 0, public: true, maxPlayers: 8, infinite: true});
}
start();

