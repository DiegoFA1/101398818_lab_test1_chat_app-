import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

export default function Login({ socket }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        error: ''
    });

    const { username, password, error } = formData;

    const onValueChanged = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value, error: '' });
    }

    const onSubmitForm = async (event) => {
        event.preventDefault();
        const data = { username, password };
        try {
            const response = await axios.post('http://localhost:8090/user/login', data);
            if (response.data) {
                localStorage.setItem('username', response.data.username);
                
                const socket = io('http://localhost:8090');
                socket.on('connect', () => {
                    console.log('Connected to Socket.IO server');
                    // Emit 'userLoggedIn' event to the server
                    socket.emit('userLoggedIn', { username: response.data.username });
                });
                navigate('/groups'); // Navigate to the specified route
            }
            console.log(response);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                setFormData({ ...formData, error: error.response.data.message });
            } else {
                setFormData({ ...formData, error: 'An unexpected error occurred.' });
            }
        }
    }

    return (
        <div className='bodyUser'>
            <div className="wrapper">
                <div className="title">
                    <h1>User Login</h1>
                </div>
                <form onSubmit={onSubmitForm}>
                    <div className="field">
                        <input
                            required
                            name='username'
                            type="text"
                            value={username}
                            onChange={onValueChanged} />
                        <label>Username</label>
                    </div>
                    <div className="field">
                        <input
                            required
                            name='password'
                            type="password"
                            value={password}
                            onChange={onValueChanged} />
                        <label>Password</label>
                    </div>
                    <div className="field">
                        <input
                            name='btnSubmit'
                            type="submit"
                            value="Login" />
                    </div>
                    <div className="error">
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </div>
                </form>
            </div>
        </div>
    );
}
