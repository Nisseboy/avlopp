const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" }});

const PORT = 8080;
const updateInterval = 100;


class Vec {
  constructor(x,y,z,w) {this.x = x; this.y = y; this.z = z; this.w = w}
}
global.Vec = Vec;

let Entity = require("./public/entity").Entity;
global.Entity = Entity;

let World = require("./public/world").World;

let lobbies = {}

app.use(express.static('public'));

app.get("/*", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

server.listen(process.env.PORT || PORT, () =>{
    console.log("http://127.0.0.1:" + PORT + "/");
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

    player = new Entity(new Vec(0, 0), "player");
    lobby.world.entities.push(player);

    socket.emit("join", {
      world: lobby.world,
      id: player.id,
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

  socket.on('update', data => {
    if (!lobby || !player) return;

    switch(data.action) {
      case "vec":
        lobby.world.entities.find(elem=>elem.id == data.id)[data.path] = data.vec;
        break;
      case "number":
        lobby.world.entities.find(elem=>elem.id == data.id)[data.path] = data.number;
        break;
    }

    emitOthers(data);
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
    world: new World(),
    sockets: {},
    events: {},
  };

  let interval = setInterval(() => {
    if (lobby.sockets.length == 0) {
      clearInterval(interval);
      delete lobbies[lobbyId];
    }

    for (let id in lobby.sockets) {
      let s = lobby.sockets[id];
      let e = lobby.events[id];

      if (e == undefined) continue;

      s.emit("update", {id: id, events: e});

      e.length = 0;
    }
  }, updateInterval);

  lobbies[lobbyId] = lobby;
  return lobby;
}
