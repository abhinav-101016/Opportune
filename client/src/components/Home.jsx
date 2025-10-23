import { useState,useEffect } from "react";
import { NavLink } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import Animation from '../animations/job.json'
import BgAnimation from '../animations/bgAni.json'


function Home(){
  const [token,setToken]=useState(null);
  const [role,setRole]=useState(null);
  const navigate=useNavigate();



   useEffect(()=>{
           const token=localStorage.getItem('webtoken');
           if(token){
            setToken(token);
            const decodedData=jwtDecode(token);
            if(decodedData){
              setRole(decodedData.role);
            }

           }

          
          },[navigate])

    const handleClick=(route)=>{
      navigate(`/${route}`);


    }
  






    return(
     <div className="relative w-full flex flex-col justify-center items-center">
  
  <div className="  relative h-[80vh] md:h-[90vh] w-full flex items-center justify-between ">
    
    
    <img
      src="/images/home.jpg" 
      alt="Hero Background" 
      className="absolute inset-0 w-full h-full opacity-80 object-cover"
    />
    
    
   <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/0"></div>

    
    
    <div className="relative text-center pl-8 sm:pl-10 mb-7 px-6">
      <h2 className="text-3xl md:text-4xl font-medium text-white">
        Connecting Talent with
      </h2>
      <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg mt-2">
        Opportunity
      </h1>
      <p className="mt-4 max-w-xl mx-auto text-gray-200 text-lg md:text-xl leading-relaxed">
        Your journey to the right career starts here.
      </p>

      
      <div className="mt-8 flex gap-4 flex-wrap justify-center">
       {(!token)&&(<> <button className="px-6 py-3 rounded-lg bg-[#03a9f4] hover:bg-[#0288d1] text-white font-semibold shadow-md transition" onClick={()=>{handleClick('signup')}}>
          Sign Up
        </button>
        <button className="px-6 py-3 rounded-lg border-2 border-white text-white font-semibold hover:bg-white hover:text-[#03a9f4] transition" onClick={()=>{handleClick('login')}}>
          Login
        </button>
       </>)}

       {(token)&&(role==='seeker')&&(<> <button className="px-6 py-3 rounded-lg bg-[#03a9f4] hover:bg-[#0288d1] text-white font-semibold shadow-md transition" onClick={()=>{handleClick('browsejobs')}}>
          Browse Jobs
        </button>
        <button className="px-6 py-3 rounded-lg border-2 border-white text-white font-semibold hover:bg-white hover:text-[#03a9f4] transition" onClick={()=>{handleClick('signup')}}>
          Jobs Applied
        </button>
       </>)}

        {(token)&&(role==='poster')&&(<> <button className="px-6 py-3 rounded-lg bg-[#03a9f4] hover:bg-[#0288d1] text-white font-semibold shadow-md transition" onClick={()=>{handleClick('postajob')}}>
          Post a Job
        </button>
        <button className="px-6 py-3 rounded-lg border-2 border-white text-white font-semibold hover:bg-white hover:text-[#03a9f4] transition" onClick={()=>{handleClick('jobsposted')}}>
          Posted Jobs
        </button>
       </>)}
      </div>
    </div>
  


    
  </div>
  <div className=" h-[100vh] w-[100vw] flex justify-between items-center z-[-10]">
    <div className="absolute inset-0 z-0 flex flex-1 justify-center items-center opacity-80  pointer-events-none">
          <Lottie 
            animationData={BgAnimation} 
            loop 
            autoplay 
            style={{ width: '100%', height: '100%',opacity: 0.5 }}
          />
        </div>

    <div className=" m-24 z-10 flex flex-1 flex-col justify-center items-start ml-12 space-y-6">
  <div className="bg-white bg-opacity-80 p-6 rounded-lg hover:shadow-2xl shadow-lg max-w-sm">
    <h3 className="text-xl font-semibold text-blue-500">For Job Seekers</h3>
    <p className="text-gray-700 mt-2">
      Find jobs that match your skills, apply instantly, and track your applications all in one place.
    </p>
  </div>
  
  <div className="bg-white bg-opacity-80 p-6 rounded-lg hover:shadow-2xl shadow-lg max-w-sm">
    <h3 className="text-xl font-semibold text-blue-500">For Recruiters</h3>
    <p className="text-gray-700 mt-2">
      Post jobs, manage applications efficiently, and connect with the best talent quickly.
    </p>
  </div>

  <div className="bg-white bg-opacity-80 p-6 rounded-lg hover:shadow-2xl shadow-lg max-w-sm">
    <h3 className="text-xl font-semibold text-blue-500">Verified & Easy</h3>
    <p className="text-gray-700 mt-2">
      Verified listings and role-based dashboards make the hiring journey smooth for everyone.
    </p>
  </div>
</div>

<div className="hidden md:flex flex-1 justify-center items-center z-10">
          <Lottie 
            animationData={Animation} 
            loop 
            autoplay 
            style={{ width: 400, height: 400 }}
          />
        </div>

  



  </div>
</div>


    )
}
export default Home