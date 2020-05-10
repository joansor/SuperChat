let http = require("http");
let fs = require("fs");
let express = require("express");

let app = express();

// Chargement du fichier index.html affiché au client
let server = http.createServer(function (req, res) {
  fs.readFile("./index.html", "utf-8", function (error, content) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(content);
  });
});

// Chargement de socket.io
let io = require("socket.io").listen(server);

io.sockets.on("connection", function (socket, pseudo, msg) {
  // Quand un client se connecte, on lui envoie un message
  socket.emit("message", "Vous êtes bien connecté !");
  // On signale aux autres clients qu'il y a un nouveau venu
  //socket.broadcast.emit('pseudo', pseudo + 'vient de se connecter ! ');

  // Dès qu'on nous donne un pseudo, on le stocke en variable de session
  socket.on("pseudo", function (pseudo) {
    socket.pseudo = pseudo; //recupere le speudo
    socket.emit("pseudo", pseudo); // on le renvoie au meme utilisateur
    socket.broadcast.emit("pseudo", pseudo); //on renvoie le pseudo a tout les autres

    //recupere le message et le speudo de celui qui l'envoie
    socket.on("msg", function (msg) {
     
      console.log(pseudo, msg);
      socket.msg = msg; // recupere le message
      socket.broadcast.emit("msg", {
      pseudo: pseudo,
      msg: msg,
      }); // si un message on revoie le pseudo + msg a tous les autres
      
    });
  });
});

server.listen(8080);
