import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
            const res=await fetch('http://localhost:1200/signup',{method:'POST',headers:{
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
    
    
    <div className="h-[85vh] w-screen bg-emerald-200 flex flex-col justify-center items-center bg-radial-[at_45%_50%] from-[#d1e8e7] to-[#0db9c5] ">
        <h2 className="pb-4 text-2xl font-bold text-blue-500">Sign-Up</h2>
        <div className="min-h-64 min-w-[45%] bg-white flex flex-col justify-center rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
       
        <form onSubmit={handleSubmit} className="flex flex-col p-12 font-medium text-gray gap-2">
            <label>Name</label>
            <input type="text" onChange={handleChange} value={formData.name} name="name"required className="border-blue-300 border-2 p-1"></input>
             <label>Email</label>
            <input type="email" onChange={handleChange} value={formData.email} name="email"required className="border-blue-300 border-2 p-1"></input>
             <label>Mob no</label>
            <input type="tel" onChange={handleChange} value={formData.mob} name="mob"required className="border-blue-300 border-2 p-1"></input>
             <label>Password</label>
            <input type="password" onChange={handleChange} value={formData.password} name="password"required className="border-blue-300 border-2 p-1"></input>
            <label>Role</label>
            <select name="role" onChange={handleChange} required className="border-blue-300 border-2 p-1">
                <option value="">Select</option>
                <option value="seeker">Job Seeker</option>
                <option value="poster">Job Poster</option>
                
            </select>
            <button type="submit" className="mt-2 m-auto w-[30%] h-8 bg-blue-500  text-white font-semibold rounded-md shadow-md transition-all">SignUp</button>
        </form>
        
         <p className="m-auto mb-4 text-2xl font-bold text-blue-600">{message}</p>
         </div>





    </div>)
}
export default SignUp1