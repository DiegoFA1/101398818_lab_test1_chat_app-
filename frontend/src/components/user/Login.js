import axios from 'axios';
import React, { Component } from 'react'


export default class Login extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            error: ''
        }
        
    }
  
    onValueChanged = (event) => {
        event.preventDefault()
        this.setState({
            [event.target.name]: event.target.value,
            error: ''
        })
    }
  
    onSubmitForm = async (event) => {
        event.preventDefault()
        const { username, password} = this.state
        const data = {
            username,
            password,
        }
        try {
            const response = await axios.post('http://localhost:8090/user/login', data);
            // Check if the response returns any data
            if (response.data) {
                localStorage.setItem('username', response.data.username);
                window.location.href = '/employee/list';
                
            }
            console.log(response);
            // If the response has data, then we will store the token in localStorage

            
            console.log(response);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                this.setState({ error: error.response.data.message });
            } else {
                this.setState({ error: 'An unexpected error occurred.' });
            }
        }
    }
  
  
  
  render = () => {
    const { error } = this.state;
    
    
    return (
        
        <div className='bodyUser'>
        <div className="wrapper">
            
            <div className="title">
            <h1>User Login</h1>
            </div>
            <form onSubmit={(e) => this.onSubmitForm(e)} > 
                <div className="field">
                    <input 
                        required
                        name='username'
                        type="text"
                        onChange={(e) => this.onValueChanged(e)}  />
                    <label>Username</label>
  
                </div>
  
                <div className="field">
                    <input 
                        required
                        name='password'
                        type="password"
                        onChange={(e) => this.onValueChanged(e)} />
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
    )
  }








}
