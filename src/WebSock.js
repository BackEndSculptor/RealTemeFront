import React, { useEffect, useRef, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';


const WebSock = ({setMapCoordinates}) => {
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
            switch (message.type) {
                case 'message':
                    setMessages(prev => [...prev, message]);
                    break;
                case 'map':

                    setMapCoordinates(message.coordinates)
                    break;
            }
        }
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
                user_id: "661fda5b8ca6b45403ad60b9",
                chat_id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                message: value,
                type: "message",
                id: Date.now(),
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
