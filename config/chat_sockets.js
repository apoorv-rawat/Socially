
module.exports.chatSockets = function (socketServer) {
    let io = require('socket.io')(socketServer, {
        cors: {
            origin: "http://localhost:8000",
            //or use origin: "*",
            methods: ["GET", "POST"]
        }
    });

    // list of users in global room
    const users = {};

    // when connect request comes from front end or subscriber
    io.on('connection', function (socket) {

        console.log('New connection req received from socket ', socket.id);

        // attaching listener on socket - when client disconnects
        socket.on('disconnect', function () {
            // io.to(userLeft.roomName).emit('user_left', userLeft.name);
            
            let userLeft = users[socket.id];
            socket.to(userLeft.roomName).emit('user_left', userLeft.name);

            // delete user from server list
            delete users[socket.id];
        });

        // client requests to join room
        socket.on('join_room', function (data) {
            // console.log('Joining req received from', data);

            users[socket.id] = {
                name: data.name,
                email: data.email,
                roomName: data.roomName
            };
        
            // add the user to the chatroom - https://socket.io/docs/v4/rooms/ - check sids and rooms map for more details
            socket.join(data.roomName);

            // emit to room name exluding client who entered https://socket.io/docs/v3/rooms/#:~:text=You%20can%20also,get%20the%20event.
            socket.to(data.roomName).emit('user_joined', data.name);
            // io.broadcast.to(data.roomName).emit('user_joined', data);

            socket.emit('welcome', data.roomName);
            // check clients in a chat room
            // let clients = io.sockets.adapter.rooms.get(data.roomName);
        });

        // client sends a message
        socket.on('send', function (data) {
            socket.to(data.roomName)
            .emit('rec', { user: users[socket.id], msg: data.msg });
        });

    });
}