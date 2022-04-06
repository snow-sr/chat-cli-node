import chalk from 'chalk';
import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';

const app = express();
const port:number = 8087;
const server = createServer(app)
const io = new Server(server);
const users = [];

app.get("/", (req, res) => {
    res.send("Hello World!");
})

io.on('connection', (socket) => {
    console.log(chalk.green(`New client connected: ${socket.id}`));
    io.emit(`connected`, socket.id);

    socket.on('users', () => {
        console.log(users)
        io.emit('users', users);
    })

    socket.on('message', (x, y) => {
        if(!users.includes(x.user)){
            users.push(x.user);
        }
        io.emit('message', x, y);
    })
})



server.listen(port, () => {
    console.log(chalk.black.bgGreen(`Server is running on port: ${port}`));
})