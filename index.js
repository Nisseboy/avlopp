const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" }});



require("./ndv");

require("./public/constants");

require("./public/entities/EntityBase");
require("./public/entities/EntityPlayer");

require("./public/objects/ObjectBase");
require("./public/objects/ObjectText");
require("./public/objects/ObjectTexture");
require("./public/objects/ObjectWater");

require("./public/Room");

require("./public/world");


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

  socket.on('event', data => {
    if (!lobby || !player) return;

    switch(data.action) {
      case "move":
        lobby.world.entities.find(elem=>elem.id == data.id).pos = data.pos;
        break;
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
