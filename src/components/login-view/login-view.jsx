import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './login-view.scss';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Container, Card, Form, Button } from 'react-bootstrap';

import axios from 'axios';

export function LoginView(props) {
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
// Declare hook for each input
  const [ usernameErr, setUsernameErr ] = useState('');
  const [ passwordErr, setPasswordErr ] = useState('');

  // validate user inputs
const validate = () => {
  let isReq = true;
  if(!username){
   setUsernameErr('Username Required');
   isReq = false;
  }else if(username.length < 2){
   setUsernameErr('Username must be 2 characters long');
   isReq = false;
  }
  if(!password){
   setPasswordErr('Password Required');
   isReq = false;
  }else if(password.length < 6){
   setPassword('Password must be 6 characters long');
   isReq = false;
  }

  return isReq;
}

  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log(username, password);
    const isReq = validate();
  if(isReq) {
    /* Send request to the server for authentication */
    /* Send a request to the server for authentication */
    /* then call props.onLoggedIn(username) */
    axios.post('https://myflix-firstmovieapp.herokuapp.com/login', {
      Username: username,
      Password: password
    })
    .then(response => {
      const data = response.data;
      props.onLoggedIn(data);
    })
    .catch(e => {
      console.log('no such user')
    });
  }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    props.toRegister();
  };


  return (
    <Container className="login-container">
    <Card className="login-card mt-5">
      <Card.Body>
        <Card.Title className="text-center" as="h4">
          Login
        </Card.Title>
    <Form>
      <Form.Group controlId="formUsername">
        <Form.Label>Username:</Form.Label>
        <Form.Control type="text" onChange={e => setUsername(e.target.value)} 
        required
        placeholder="Please enter your Username"/>
        {/* code added here to display validation error */}
        {usernameErr && <p>{usernameErr}</p>}
      </Form.Group>

      <Form.Group controlId="formPassword">
        <Form.Label>Password:</Form.Label>
        <Form.Control type="password" onChange={e => setPassword(e.target.value)} 
         required
         placeholder="Please enter your Password"
         />
         {/* code added here to display validation error */}
        {passwordErr && <p>{passwordErr}</p>}
      </Form.Group>

      <Button className="login-button mt-2 mr-2" variant="primary" type="submit" onClick={handleSubmit}>
        Sign in
      </Button>
      <Button className="register-button mt-2" variant="secondary" type="submit" onClick={handleRegisterClick}>
        Register
      </Button>
     
    </Form>
    </Card.Body>
    </Card>
    </Container>
  );
}

LoginView.propTypes = {
  onLoggedIn: PropTypes.func.isRequired,
  toRegister: PropTypes.func.isRequired,
};