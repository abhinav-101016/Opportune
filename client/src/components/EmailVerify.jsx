import { useState,useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Lottie from "lottie-react";
import BgAnimation from '../animations/bgAni.json'



function EmailVerify(){





    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate=useNavigate();
    const userEmail=localStorage.getItem("email");
   
    const [formData,setFormData]=useState({
        otp:'',
        email:userEmail ||''
    })
    
     const [message,setMessage]=useState('')

     useEffect(()=>{
        const isSignUpComplete=localStorage.getItem("signupComplete")
        if(!isSignUpComplete ||!userEmail){
            navigate("/signup");
        }
     },[navigate])

     function handleChange(e){
        setFormData({...formData,[e.target.name]:e.target.value});



     }
    async function handleSubmit(e){
        e.preventDefault();

        try {  const res=await fetch(`${apiUrl}/api/auth/verify`,{method:'POST',headers:{
            'Content-Type':'application/json'
        },body:JSON.stringify(formData)}
        )
        const result=await res.json();

        if(res.status===200){
            setMessage("Email Verified Successfully!");
            const isSeeker=localStorage.getItem("isSeeker");
            setTimeout(() => {
                if(isSeeker){
                    navigate('/seeker-complete-profile');
                }
                else{
                    navigate('/poster-complete-profile');

                }
                
                
            }, 500);

            
            
        }
        else{
            setMessage(result.message ||" Invalid OTP,please try again");

        }
            

            }
            
        catch (error) {
            setMessage("Server error, try again later.");

        }


    }


  return(
    <div className="h-screen w-screen  flex flex-col justify-center bg-gray-100 items-center bg-cover ">

         <div className="absolute inset-0 z-0 flex flex-1 justify-center items-center opacity-80 pointer-events-none ">
                  <Lottie 
                    animationData={BgAnimation} 
                    loop 
                    autoplay 
                    style={{ width: '100%', height: '100%',opacity: 0.5 }}
                  />
                </div>

             <h2 className="pb-4 text-3xl font-medium text-gray-700">Verify Email</h2>


              <div className=" sm:min-w-[45%] sm:min-h-68 bg-white-200  bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-200 flex flex-col justify-center rounded-md shadow-xl hover:shadow-2xl transition-shadow duration-300">
                 
                 <form onSubmit={handleSubmit} className="flex flex-col pr-6 pl-6 sm:pr-12 sm:pl-12 pt-12 pb-6 font-medium text-gray-900 gap-3">
                   <p className="text-sm text-gray-500 mb-2 text-center sm:text-left">
  OTP has been sent to your email: <span className="font-medium text-gray-700">{userEmail}</span>
</p>
                   
                   
                   <label>Enter the OTP</label>

                   <input type="text" onChange={handleChange} value={formData.otp} name="otp" required className="border-gray-400 border-1 p-1 rounded" />
                   
                  
                   <button type="submit" className="mt-2 m-auto w-[70%] sm:w-[30%] h-10 text-lg bg-gradient-to-r from-[#03a9f4] via-[#3caee3] to-[#0184c1] hover:bg-gradient-to-br focus:ring-2 focus:outline-[#03a9f4] focus:ring-[#76c7ed] dark:focus:ring-[#03a9f4] text-white font-semibold rounded-md shadow-md transition-all">
                     Verify OTP
                   </button>
                 </form>
             
                 <p className="m-auto text-lg sm:text-xl font-bold text-gray-700">{message}</p>
               </div>



    </div>

       
    )

}

export default EmailVerify;