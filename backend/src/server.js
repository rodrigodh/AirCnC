const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const socketio = require('socket.io');
const http = require('http');

const routes = require('./routes');

const app = express();
// Pegando a aplicacao em express e passando pro http
const server = http.Server(app);
const io = socketio(server);

const connectedUsers = {

};


mongoose.connect('mongodb+srv://medonho:medonho@omnistack3-3w2p5.mongodb.net/omnistack3?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Fica escutando caso alguem se conecta com o backend e salva na variavel
io.on('connection', socket => {
    const user_id = socket.handshake.query.user_id

    connectedUsers[user_id] = socket.id;
});

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
})


app.use(cors());
app.use(express.json());
// cria rota para arquivos estaticos, como imagens
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);

server.listen(3333);

//req.query = Acessar query params (para filtros)
//req.params = Acessar route params (para edição, delete)
//req.body = Acessar corpo da requisicao (para criacao, edicao )