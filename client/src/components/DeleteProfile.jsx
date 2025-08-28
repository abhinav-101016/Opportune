import { useState,useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../Context/LoginContext";

function DeleteProfile(){
    const navigate=useNavigate()

    const [password,setPassword]=useState('')
    const [userId,setUserId]=useState('')
    const [message,setMessage]=useState('')
    const {setIsLoggedIn}=useLogin()
    useEffect(()=>{
        const token=localStorage.getItem("webtoken")
        if(!token){
            setMessage("You are not Logged In")
            setTimeout(()=>{
                navigate('/login')
            },500)
            return

        }
        const decodedData= jwtDecode(token)
        setUserId(decodedData.id)


    },[])
     const handleChange=(e)=>{
       setPassword(e.target.value)

     }
     const handleSubmit=async(e)=>{
        e.preventDefault()
        const data={
            password:password
            ,
            userId:userId
        }
        try {
            const token=localStorage.getItem("webtoken")
             const res=await fetch('http://localhost:1200/deleteprofile',{method:'POST',
            headers:{
                Authorization: `Bearer ${token}`,
            
            'Content-Type':'application/json'

            },body:JSON.stringify(data)
        })
        

        setPassword('')
        const result = await res.json();
        if(res.ok){
            localStorage.removeItem("webtoken")
             setIsLoggedIn(false);
            setMessage(result.message||"Profile Deleted Successfully")
             setTimeout(() => {
        navigate("/login"); 
    }, 1500);
        }
        else{
             setMessage(result.message || "Failed to delete profile.");
        }

            
        } catch (error) {
            setMessage("Something Went Wrong")

            
        }
       
     }

     return(

        <div className="h-screen w-screen bg-radial-[at_45%_50%] from-[#d1e8e7] to-[#0db9c5] flex flex-col justify-center items-center">
            <h2 className="pb-4 text-2xl font-bold text-blue-500">Delete Profile</h2>
            <div className="min-h-64 min-w-[45%] bg-white flex flex-col justify-center rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
       

                 

                <form onSubmit={handleSubmit} className="flex flex-col p-12 font-medium text-gray gap-2">
                    <label>Enter Your Password</label>
                    <input type="password" onChange={handleChange} required name="password" value={password} className="border-blue-300 border-2 p-1"></input>
                    <button type="submit" className="mt-2 m-auto w-[30%] h-8 bg-blue-500  text-white font-semibold rounded-md shadow-md transition-all">Delete Profile</button>
                </form>
                 <p className="m-auto mb-4 text-2xl font-bold text-blue-600">{message}</p>
            </div>
           
             <p className=" max-w-[45%] text-m font-bold text-center pt-4 text-[#f4120a] " >
                ⚠️ Once you delete your profile, all your data including posted jobs will be
                 permanently removed. This action is irreversible.
                 </p>
  

        </div>
     )

}
export default DeleteProfile