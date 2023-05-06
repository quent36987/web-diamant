import { infoLog } from './logger';
import { Socket } from 'socket.io-client';

function emit(socket: Socket, event: any, ...args: any[]): Socket {
    infoLog(`Emitted ${event}`, args);
    return socket.emit(event, ...args);
}

export { emit };
