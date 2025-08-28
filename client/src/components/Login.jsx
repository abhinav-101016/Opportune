import React from "react";
import { useState } from "react";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import { useLogin } from "../Context/LoginContext";


function Login(){
    const Navigate=useNavigate()
    const {setIsLoggedIn}=useLogin()
    const [loginData,setloginData]=useState({
        identifier:'',
        password:''


    })
    

    const[message,setMessage]=useState('')
    function handleChange(e){
        setloginData({...loginData,[e.target.name]:e.target.value})
    }

async function handleLogin(e) {
    e.preventDefault();

    try {
        const response = await fetch('http://localhost:1200/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });

        const data = await response.json();

        if (response.ok && data.token) {
            localStorage.setItem('webtoken', data.token);
            setMessage("Login successful!");
            setIsLoggedIn(true);
            setTimeout(() => {
                Navigate('/');
            }, 1000);
        } else {
            setMessage(data.message || "Login failed");
            setloginData({ identifier: '', password: '' });  
        }

    } catch (error) {
        console.error("Fetch error:", error);
        setMessage("Something went wrong. Please try again.");
    }
}


    



    return(
        <div className="h-screen w-screen  flex flex-col justify-center bg-radial-[at_45%_50%] from-[#d1e8e7] to-[#0db9c5] items-center bg-cover "  >
            <h2 className="pb-4 text-2xl font-bold text-blue-500">Login</h2>
            <div  className="min-h-64 min-w-[45%] bg-white flex flex-col justify-center rounded-2xl shadow-2xl hover:shadow-4xl transition-shadow duration-300">
       
            <form onSubmit={handleLogin} className="flex flex-col p-12 font-medium text-gray gap-2">
                <label>Email or Mobile Number</label>
                <input type="text" value={loginData.identifier} name="identifier" required onChange={handleChange} className="border-blue-300 border-2 p-1"></input>
                <label>Password</label>
                <input type="password" name="password" value={loginData.password} required onChange={handleChange} className="border-blue-300 border-2 p-1"></input>
                <button type="submit" className="mt-2 m-auto w-[30%] h-8 bg-blue-500 text-white font-semibold rounded-md shadow-md transition-all">Log In</button>
            </form>
           

            
           <p className="m-auto mb-4 text-2xl font-bold text-blue-600">{message}</p>
           </div>
        </div>


    )
}

export default Login