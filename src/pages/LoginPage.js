import React from "react";

import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export function setAuthToken(token) {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
  else
    delete axios.defaults.headers.common["Authorization"];
}

export default function LoginPage() {
  const navigate = useNavigate();

  const handleSubmit = e => {
    // Prevent the default submit and page reload
    e.preventDefault()

    // Handle validations
    axios
      .post("http://localhost:3000/users/login", { userName, password })
      .then(response => {
        console.log(response.data)
        // Handle response
        if (response.status === 200) {

          localStorage.setItem("isEmployee", response.data.role);
          localStorage.setItem("userId", response.data.userId);
          console.log(localStorage.getItem("isEmployee"))
          //get token from response
          const token = response.data.token;

          //set JWT token to local
          localStorage.setItem("token", token);

          //set token to axios common header
          setAuthToken(token);
          navigate('/reserveTable')

        }
      })
  }

  const [userName, setUserName] = useState()
  const [password, setPassword] = useState()

  return (
    <div>
      <form action="" id="login" method="post" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <p className="item">
          <label> User Name </label>
          <input
            type="userName"
            name="userName"
            id="userName"
            value={userName}
            onChange={e => setUserName(e.target.value)}
          />
        </p>
        <p className="item">
          <label> Password </label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </p>
        <p className="item">
          <input type="submit" value="Login" />
        </p>
      </form>
    </div>
  );
}