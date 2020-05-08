import io from 'socket.io';
let ioServer = { uploading: false };

export default {
  init: (httpServer) => {
    ioServer.io = io(httpServer);
    return ioServer.io;
  },
  getIO: () => {
    if (!ioServer.io) throw new Error('Socket must be initialized');
    return ioServer;
  },
};
