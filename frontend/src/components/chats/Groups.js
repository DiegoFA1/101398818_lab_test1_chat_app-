import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import io from 'socket.io-client';
import './ChatStyle.css';

export default function Groups() {
    const [messages, setMessages] = useState([]);
    const { groupName } = useParams();
    const socket = io("http://localhost:8090");
    socket.on("connect", () => {
        console.log("Connected to the server");
    }); 

    useEffect(() => {
        getMessages();
    
        socket.on("chatMessage", handleIncomingMessage);
        socket.on("join", handleUserJoined); 
        socket.on("groupLeft", handleUserJoined);
    
        return () => {
            socket.off("chatMessage", handleIncomingMessage);
            socket.off("join", handleUserJoined);
            socket.off("groupLeft", handleUserJoined);
        };
    }, []);
    

    function getMessages() {
        axios.get(`http://localhost:8090/chat/messages/${groupName}`)
            .then(response => {
                setMessages(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    function sendMessage(message) {
        axios.post(`http://localhost:8090/chat/messages/${groupName}`, {
            message: message,
            from_user: localStorage.getItem("username")
        })
        .then(response => {
            console.log(response);
            getMessages();
        })
        .catch(error => {
            console.log(error);
        });
    }

    function handleIncomingMessage(message) {
        setMessages(prevMessages => [...prevMessages, message]);
    }

    function handleUserJoined(username) {
        console.log(`${username} joined the group`);
        // Fetch messages again when a new user joins
        getMessages();
    }

    return (
        <div className='bodyChat'>
            <div className="chatwrapper">
                <div className="chattitle">
                    <h2>Group: {groupName}</h2>
                </div>
                <ul>
                    {messages.map((message, index) => (
                        <li className='lichat' key={index}>{message.message}</li>
                    ))}
                </ul>

                <input type="text" id="message" placeholder="Type a message..." />
                <button onClick={() => {
                    const message = document.getElementById("message").value;
                    sendMessage(message);
                    socket.emit("chatMessage", {
                        message: message,
                        username: localStorage.getItem("username"),
                        groupName: groupName
                    });
                }}>Send</button>
                <button onClick={() => {
                    localStorage.removeItem("groupName");
                    socket.emit("groupLeft", localStorage.getItem("username"), groupName);
                    window.location.href = "/groups";
                }}>Leave Group</button>

            </div>
        </div>
    );
}
