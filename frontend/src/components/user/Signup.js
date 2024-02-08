import axios from 'axios';
import React, { Component } from 'react'
import UserStyles from './UserStyle.css'

export default class Signup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            email: '',
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
        const { username, firstname, lastname, password } = this.state
        const data = {
            username,
            firstname,
            lastname,
            password
        }
        try {
            const response = await axios.post('http://localhost:8090/user/signup', data);
            // Check if the response returns any data
            if (response.data) {
                alert('User added successfully')
                window.location.href = '/';
            }
        
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
        
        <div className="bodyUser">
        <div className="wrapper">
            
            <div className="title">
            <h1>User Form Class</h1>
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
                        name='firstname'
                        type="text"
                        onChange={(e) => this.onValueChanged(e)}  />
                    <label>First Name</label>

                </div>
                <div className="field">
                    <input 
                        required
                        name='lastname'
                        type="text"
                        onChange={(e) => this.onValueChanged(e)}  />
                    <label>Last Name</label>

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
                        value="Register" />
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
