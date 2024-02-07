import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import io from 'socket.io-client'; // Import Socket.IO client

export default function Groups() {
    const [messages, setMessages] = useState([]);
    const { groupName } = useParams();
    const socket = io("http://localhost:8090"); // Initialize Socket.IO client

    useEffect(() => {
        // Fetch messages when the component mounts
        getMessages();

        window.addEventListener("beforeunload", handleBeforeUnload);

        // Clean up function to remove event listener when component unmounts
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            // Disconnect Socket.IO when component unmounts
            socket.disconnect();
        };
    }, []);

    function getMessages() {
        axios.get(`http://localhost:8090/chat/messages/${groupName}`)
            .then(response => {
                setMessages(response.data.map(messageObject => messageObject.message));
            })
            .catch(error => {
                console.log(error);
            });
    }

    function handleBeforeUnload(event) {
        // send a message to the server when the user leaves the page with username and group
        socket.emit("groupLeft", (localStorage.getItem("username"), groupName));
    }

    return (
        <div>
            <h2>Group: {groupName}</h2>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>{message}</li>
                ))}
            </ul>
        </div>
    );
}
