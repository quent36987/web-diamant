import React, { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const app = createContext(null);

interface IAppState {
    socket: Socket;
    user: string;
    setUser: (user: string) => void;
}

// eslint-disable-next-line react/prop-types
const Context = ({ children }): JSX.Element => {
    const [socket, setSocket] = useState<Socket>(null);
    const [user, setUser] = useState<string>(null);

    useEffect(() => {
        if (socket === null) {
            setSocket(io('localhost:3005'));
            console.log('socket', socket);
        }
    }, []);

    return (
        <app.Provider
            value={{
                socket,
                user,
                setUser
            }}>
            {children}
        </app.Provider>
    );
};

const AppState = (): IAppState => {
    return useContext(app);
};

export { Context, AppState };
