
const http = require('http').createServer();

// Allow all sources to access this server...
const io = require('socket.io')(http, {
    cors: { origin: "*" }
});

// Data
const messages = [];
let users = [];

io.on('connection', (socket) => {
    socket.on('message', data =>     {
        // add the new message to the data.
        messages.push({
            message:data.message,
            sender:data.sender
        });

        // Broadcast the new message to all clients.
        io.emit('message', data );   
    });

    socket.on('join-chat', data => {
        // Add new user to the data.
        users.push(data);

        // Broadcast the messages and users to the newly joined user only.
        socket.emit('join-chat',{users:users.filter((user) =>
            user != data
        ), messages:messages});

        // Broadcast the new user joined to all clients except him.
        socket.broadcast.emit('new-user-joined', data);
    });

    socket.on('exit-chat', data =>{
        // Remove the user from the data.
        users = users.filter((username) => username != data);

        // Broadcast the removed user to all clients except him.
        socket.broadcast.emit('remove-user', data);
    });
});

http.listen(8080, () => console.log('listening on http://localhost:8080') );