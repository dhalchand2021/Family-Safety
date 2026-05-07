const handleConnection = (io, socket) => {
  // Join a specific room based on device/user ID
  socket.on('join', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  // WebRTC Signaling
  socket.on('offer', (data) => {
    const { target, offer, type } = data;
    socket.to(target).emit('offer', { sender: socket.id, offer, type });
  });

  socket.on('answer', (data) => {
    const { target, answer } = data;
    socket.to(target).emit('answer', { sender: socket.id, answer });
  });

  socket.on('ice-candidate', (data) => {
    const { target, candidate } = data;
    socket.to(target).emit('ice-candidate', { sender: socket.id, candidate });
  });

  // Command handling
  socket.on('command', (data) => {
    const { target, command, payload } = data;
    console.log(`Command ${command} sent to ${target}`);
    socket.to(target).emit('command', { command, payload });
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
};

module.exports = { handleConnection };
