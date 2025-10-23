import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import BgAnimation from '../animations/bgAni.json'



function SignUp1(){
    const navigate=useNavigate()
    const [formData,setFormData]=useState({
        name:'',
        email:'',
        mob:'',
        password:'',
        role:''
    })
    const [message,setMessage]=useState('')
    function handleChange(e){
        setFormData({...formData,[e.target.name]:e.target.value});
    }

    async function handleSubmit(e){
        e.preventDefault();
        try {
            const res=await fetch('http://localhost:1200/api/auth/signup',{method:'POST',headers:{
            'Content-Type':'application/json'
        },body:JSON.stringify(formData)}
        )
        const result=await res.json()
        localStorage.setItem('email',formData.email);
        if(res.ok){
            localStorage.setItem('signupComplete', 'true');
            if(formData.role==="seeker"){
                 localStorage.setItem('isSeeker', 'true');
            }
            //setMessage('SignUp Sucessful! Now Login ')
            setTimeout(() => {
                if(formData.role==='seeker'){
                    navigate('/seeker-complete-profile');
                }
                else{
                    navigate('/poster-complete-profile');

                }
                
                
            }, 500);
            
            setFormData({name:'',email:'',mob:'',password:''})
           
        }
        else{
            setMessage(`Error: ${result.error || 'Something went wrong'}`);

        }
            
        } catch (error) {
            console.error(error);
            setMessage('Server error. Try again later.');    
        }
        
        
    }

    return(
    
    
    <div className="h-screen w-screen bg-gray-100 flex flex-col justify-center items-center">

         <div className="absolute inset-0 z-0 flex flex-1 justify-center items-center opacity-80 pointer-events-none ">
          <Lottie 
            animationData={BgAnimation} 
            loop 
            autoplay 
            style={{ width: '100%', height: '100%',opacity: 0.5 }}
          />
        </div>
  <h2 className="pb-5 mt-25 text-3xl font-medium text-gray-700">Sign-Up</h2>
  
  <div className=" sm:min-w-[45%] sm:min-h-68 bg-white-200  bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-200 flex flex-col justify-center rounded-md shadow-xl hover:shadow-2xl transition-shadow duration-300">
    
    <form onSubmit={handleSubmit} className="flex flex-col pr-6 pl-6 sm:pr-12 sm:pl-12 pt-12 pb-6 font-medium text-gray-900 gap-3">
      <label>Name</label>
      <input type="text" onChange={handleChange} value={formData.name} name="name" required className="border-gray-400 border-1 p-1 rounded" />
      
      <label>Email</label>
      <input type="email" onChange={handleChange} value={formData.email} name="email" required className="border-gray-400 border-1 p-1 rounded" />
      
      <label>Mob no</label>
      <input type="tel" onChange={handleChange} value={formData.mob} name="mob" required className="border-gray-400 border-1 p-1 rounded" />
      
      <label>Password</label>
      <input type="password" onChange={handleChange} value={formData.password} name="password" required className="border-gray-400 border-1 p-1 rounded" />
      
      <label>Role</label>
      <select name="role" onChange={handleChange} required className="border-gray-400  border-1 p-1 rounded">
        <option value="">Select</option>
        <option value="seeker">Job Seeker</option>
        <option value="poster">Job Poster</option>
      </select>
      
      <button type="submit" className="mt-2 m-auto w-[70%] sm:w-[30%] h-10 text-lg bg-gradient-to-r from-[#03a9f4] via-[#3caee3] to-[#0184c1] hover:bg-gradient-to-br focus:ring-2 focus:outline-[#03a9f4] focus:ring-[#76c7ed] dark:focus:ring-[#03a9f4] text-white font-semibold rounded-md shadow-md transition-all">
        Sign-Up
      </button>
    </form>

    <p className="m-auto text-lg sm:text-2xl font-bold text-gray-700">{message}</p>
  </div>
</div>
)
}
export default SignUp1