import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './ChatStyle.css';
import io from 'socket.io-client'; // Import socket.io-client
import axios from 'axios';

export default class Groups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedGroup: null
    };

    this.username = localStorage.getItem('username');

  }

  handleGroupSelect = (group) => {
    this.setState({ selectedGroup: group });
    const data = {
      username: this.username,
    }
    localStorage.setItem('groupName', group);
    axios.post(`https://socksapp-4a5c68e8d8a8.herokuapp.com/chat/joinGroup/${group}`, data);
    io('https://socksapp-4a5c68e8d8a8.herokuapp.com').emit('join', this.username, group);

  };

  render() {
    const { selectedGroup } = this.state;

    return (
      <div className='bodyUser'>
        <div className="wrapper">
          <div className="title">
            <h2>Choose a Group</h2>
          </div>
          <ul className=''>
            <div className='chatfield'>
              <li onClick={() => this.handleGroupSelect('devops')}>
                <Link to={`/group/devops`}>Devops</Link>
              </li>
            </div>
            <div className='chatfield'>
              <li onClick={() => this.handleGroupSelect('cloud_computing')}  >
                <Link to={`/group/cloud_computing`}>Cloud computing</Link>
              </li>
            </div>
            <div className='chatfield'>
              <li onClick={() => this.handleGroupSelect('covid')}>
                <Link to={`/group/covid`}>Covid</Link>
              </li>
            </div>
            <div className='chatfield'>
              <li onClick={() => this.handleGroupSelect('sports')}>
                <Link to={`/group/sports`}>sports</Link>
              </li>
            </div>
            <div className='chatfield'>
              <li onClick={() => this.handleGroupSelect('nodeJS')}>
                <Link to={`/group/nodeJS`}>nodeJS</Link>
              </li>
            </div>
          </ul>
        </div>
      </div>
    );
  }
}