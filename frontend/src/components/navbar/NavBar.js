import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './navbar.css'

export default class NavBar extends Component {
    user= localStorage.getItem('username');

    logout(){
        localStorage.clear();
        window.location.href = '/';
    }

  render() {
    if(this.user == null){
        return (
            <nav className='navNavbar'>
              <Link to="/signup">Signup</Link>
              <Link to="/">Login</Link>
            </nav>
          
        )
    }
    else{
        return (
          <div className='navigation'>
            <nav className='navLeft'>              
              <Link to="">Group Chats </Link>
              <Link to="">Private Chats</Link>
            </nav>
            <nav className='navRight'>
              <Link to="/" onClick={this.logout}>Logout</Link>
              <p>This is user is Logged In: {this.user}</p>
            </nav>
          </div>
        )
    }

  }
}
