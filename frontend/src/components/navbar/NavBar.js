import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import io from 'socket.io-client'; 

export default class NavBar extends Component {
    logout = () => {
        io('http://localhost:8090').emit('disconnect');
        localStorage.clear();
        window.location.href = '/';
        
    }

    render() {
        const user = localStorage.getItem('username');

        if (user === null) {
            return (
                <nav className='navNavbar'>
                    <Link to="/signup">Signup</Link>
                    <Link to="/">Login</Link>
                </nav>
            );
        } else {
            return (
                <div className='navigation'>
                    <nav className='navLeft'>
                        <Link to="/groups">Group Chats</Link>
                        <Link to="/private">Private Chats</Link>
                    </nav>
                    <nav className='navRight'>
                        <Link to="/" onClick={this.logout}>Logout</Link>
                        <p>This user is Logged In: {user}</p>
                    </nav>
                </div>
            );
        }
    }
}