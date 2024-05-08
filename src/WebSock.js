import React, { useEffect, useRef, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';

const WebSock = () => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
    const socket = useRef(null);
    const [connected, setConnected] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        return () => {
            if (socket.current) {
                socket.current.close();
            }
        };
    }, []);

    function connect() {
        //socket.current = new ReconnectingWebSocket('wss://ws-app-ps7f3efk3q-uc.a.run.app');
        socket.current = new ReconnectingWebSocket('ws://localhost:8080');

        socket.current.onopen = (event) => {
            console.log(event);
            setConnected(true);
            const message = {
                event: 'connection',
                user: username,
                id: Date.now(),
            };
            socket.current.send(JSON.stringify(message));
        };
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
                setMessages(prev => [...prev, message]);
        };
        socket.current.onclose = () => {
            console.log('Socket closed');
        };
        socket.current.onerror = () => {
            console.log('Socket error occurred');
        };
    }

    const sendMessage = () => {
        const message = {
            user: username,
            message: value,
            date: Date.now(),
            event: 'message'
        };
        socket.current.send(JSON.stringify(message));
        setValue('');
    };

    if (!connected) {
        return (
            <div className="center">
                <div className="form">
                    <input
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        type="text"
                        placeholder="Enter your name"/>
                    <button onClick={connect}>Sign in</button>
                </div>
            </div>
        );
    }

    return (
        <div className="center">
            <div>
                <div className="form">
                    <input value={value} onChange={e => setValue(e.target.value)} type="text"/>
                    <button onClick={sendMessage}>Send</button>
                </div>
                <div className="messages">
                    {messages.map(mess =>
                        <div key={mess.id}>
                            {mess.event === 'connection'
                                ? <div className="connection_message">
                                    User {mess.user} connected
                                </div>
                                : <div className="message">
                                    {mess.user}
                                    <div className="message1">
                                        {mess.message}
                                    </div>
                                </div>
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WebSock;
