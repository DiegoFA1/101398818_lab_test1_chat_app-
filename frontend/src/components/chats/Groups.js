import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import io from 'socket.io-client';
import './ChatStyle.css';

export default function Groups() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const { groupName } = useParams();
    const socket = io("https://socksapp-4a5c68e8d8a8.herokuapp.com");
    socket.on("chatMessage", handleIncomingMessage);
    socket.on("join", handleIncomingMessage); 
    socket.on("groupLeft", handleIncomingMessage);

    useEffect(() => {

        // Cleanup socket event subscriptions when component unmounts
        return () => {
            socket.off("chatMessage", handleIncomingMessage);
            socket.off("join", handleIncomingMessage);
            socket.off("groupLeft", handleIncomingMessage);
        };
    }, []);

    async function getMessages() {
        try {
            const response = await axios.get(`https://socksapp-4a5c68e8d8a8.herokuapp.com/chat/messages/${groupName}`);
            setMessages(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    function sendMessage() {
        // Emit message through socket
        socket.emit("chatMessage", {
            message: inputMessage,
            from_user: localStorage.getItem("username"),
            groupName: groupName
        });

        // Reset input
        setInputMessage('');

        // Post message through axios
        axios.post(`https://socksapp-4a5c68e8d8a8.herokuapp.com/chat/messages/${groupName}`, {
            message: inputMessage,
            from_user: localStorage.getItem("username")
        })
        .then(response => {
            // Refresh messages
            getMessages();
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        });
    }

    function handleIncomingMessage() {
        getMessages();
    }

    function handleInputChange(event) {
        setInputMessage(event.target.value);
    }

    function leaveGroup() {
        localStorage.removeItem("groupName");
        socket.emit("groupLeft", localStorage.getItem("username"), groupName);
        window.location.href = "/groups";
    }

    return (
        <div className='bodyChat'>
            <div className="chatwrapper">
                <div className="chattitle">
                    <h2>Group: {groupName}</h2>
                </div>
                <ul>
                    {messages.map((message, index) => (
                        <li className='lichat' key={index}>{message.from_user + ": " + message.message }</li>
                    ))}
                </ul>

                <input 
                    type="text" 
                    id="message" 
                    placeholder="Type a message..."
                    value={inputMessage}
                    onChange={handleInputChange}
                />

                <button onClick={sendMessage}>Send</button>

                <button onClick={leaveGroup}>Leave Group</button>

            </div>
        </div>
    );
}