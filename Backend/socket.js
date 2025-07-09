const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) 
{
    // Initializes Socket.IO on your existing HTTP server.
    io = socketIo(server, {
        cors: {
            origin: '*', // Allows connections from any domain (e.g. localhost, staging frontend, production).
            methods: [ 'GET', 'POST' ]
        }
    });

    // This listens for new socket connections, 'connection' is an event
    io.on('connection', (socket) => 
    {
        console.log(`Client connected: ${socket.id}`); // Each socket connection has a unique socket.id

        // 'join' is a custom event
        socket.on('join', async (data) => 
        {
            const { userId, userType } = data;

            console.log(`User ${userId} joined as ${userType}`);

            if (userType === 'user')  // Saves the socket.id to the DB so you can send targeted messages later
            {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
            else if (userType === 'captain')
            {
                await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
        });


        socket.on('update-location-captain', async (data) => 
            {
                const { userId, location } = data;

                if (!location || !location.ltd || !location.lng) 
                {
                    return socket.emit('error', { message: 'Invalid location data' });
                }

                await captainModel.findByIdAndUpdate(userId, { location: { ltd: location.ltd, lng: location.lng }});
        });

        socket.on('disconnect', () => 
        {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

function sendMessageToSocketId(socketId, messageObject) 
{
    console.log(messageObject);

    if(io) 
    {
        // io.to(socketId) targets a specific connected client.
        io.to(socketId).emit(messageObject.event, messageObject.data); 
    } 
    else 
    {
        console.log('Socket.io not initialized.');
    }
}

module.exports = { initializeSocket, sendMessageToSocketId };

