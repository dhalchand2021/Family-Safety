const { handleConnection } = require('./socketHandlers');

const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);
    handleConnection(io, socket);
  });
};

module.exports = setupSocketHandlers;
