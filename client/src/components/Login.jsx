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
        <div className="h-screen w-screen  flex flex-col justify-center bg-gray-100 items-center bg-cover "  >
            <h2 className="pb-4 text-3xl font-medium text-gray-700">Login</h2>
            <div  className="min-h-64 max-w-[55%] sm:min-w-[45%] bg-white-200  bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-200 flex flex-col justify-center rounded-md shadow-xl hover:shadow-2xl transition-shadow duration-300">
       
            <form onSubmit={handleLogin} className="flex flex-col p-12 text-sm sm:text-lg font-medium text-gray-900 gap-4">
                <label>Email or Mobile Number</label>
                <input type="text" value={loginData.identifier} name="identifier" required onChange={handleChange} className="border-gray-400 border-1  p-1 rounded"></input>
                <label>Password</label>
                <input type="password" name="password" value={loginData.password} required onChange={handleChange} className="border-gray-400 border-1 p-1 rounded"></input>
                <button type="submit" className="mt-2 m-auto w-[80%] sm:w-[30%] h-10 text-lg bg-gradient-to-r from-[#03a9f4] via-[#3caee3] to-[#0184c1] hover:bg-gradient-to-br focus:ring-2 focus:outline-[#03a9f4] focus:ring-[#76c7ed] dark:focus:ring-[#03a9f4]   text-white font-semibold rounded-md shadow-md transition-all">Log In</button>
            </form>
           

            
           <p className="m-auto mb-4  font-bold  text:xl sm:text-2xl text-gray-700">{message}</p>
           </div>
        </div>


    )
}

export default Login