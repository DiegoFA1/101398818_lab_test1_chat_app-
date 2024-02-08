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

    useEffect(() => {
        getMessages();

        socket.on("chatMessage", handleChatMessage);
        socket.on("join", handleUserJoin);
        socket.on("groupLeft", handleUserLeft);

        // Clean up function to remove event listeners when component unmounts
        return () => {
            socket.off("chatMessage", handleChatMessage);
            socket.off("join", handleUserJoin);
            socket.off("groupLeft", handleUserLeft);
        };
    }, []); 

    const handleChatMessage = (message) => {
        setMessages(prevMessages => [...prevMessages, message]);
        console.log("Client- Message received: ", message);
    };

    const handleUserJoin = (userData) => {
        setMessages(prevMessages => [...prevMessages, {from_user: userData, message: userData + " Joined the group"}]);
        console.log("Client- User joined: ", userData);
    };

    const handleUserLeft = (message) => {
        setMessages(prevMessages => [...prevMessages, message]);
        console.log("Client- User left: ", message);
    };

    async function getMessages() {
        try {
            const response = await axios.get(`https://socksapp-4a5c68e8d8a8.herokuapp.com/chat/messages/${groupName}`);
            setMessages(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function sendMessage() {
        const messageData = {
            message: inputMessage,
            from_user: localStorage.getItem("username"),
            groupName: groupName
        };

        try {
            socket.emit("chatMessage", messageData);
            await axios.post(`https://socksapp-4a5c68e8d8a8.herokuapp.com/chat/messages/${groupName}`, messageData);
            getMessages();
            setInputMessage('');
        } catch (error) {
            console.log(error);
        }
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