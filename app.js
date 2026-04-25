
const { log } = require('console');
const express = require('express');
const http = require('http');
const { disconnect, emit } = require('process');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.render('index');
});
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');


app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

let socketsConnected = new Set()

io.on('connection', onConnected)
  
function onConnected(socket){
  console.log(socket.id);
  socketsConnected.add(socket.id)

  io.emit('clients-total', socketsConnected.size)

  socket.on('disconnect',() =>{
    console.log('Socket disconnected', socket.id);
    socketsConnected.delete(socket.id)
    io.emit('clients-total', socketsConnected.size)
    
  })
  socket.on('message', (data) =>{
    // console.log(data);
    
    socket.broadcast.emit('chat-message', data)
  })
  socket.on('feedback', (data) => {
    socket.broadcast.emit('feedback', data)
  })
}


server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

