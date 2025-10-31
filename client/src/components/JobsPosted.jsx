import { useState,useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import BgAnimation from '../animations/bgAni.json'


function JobsPosted(){
  const apiUrl = import.meta.env.VITE_API_URL;

    const navigate=useNavigate();

    const [postedJobs,setPostedJobs]=useState([]);
    const [message,setMessage]=useState("");
    const [userId,setUserId]=useState(null);

    const handleApply=(jobId)=>{
      return navigate(`/applications?jobId=${jobId}`);
    }
    useEffect(()=>{
         const token=localStorage.getItem('webtoken');
         if(!token){
            navigate('/login');
         }
         const decodedData=jwtDecode(token);
         if(decodedData.role!="poster"){
            navigate("/");
         }
         
        setUserId(decodedData.id);
         
    
    
    
    
    
},[navigate])

 useEffect(()=>{
     if (!userId) return;
         async function showPostedJobs(){
         try {
         const token=localStorage.getItem("webtoken")

    const res =await fetch(`${apiUrl}/jobsposted?userId=${userId}`,{method:'GET',
        headers:{
             Authorization: `Bearer ${token}`,
            
                'Content-Type':'application/json'
            
        }
    })
    const result=await res.json()
    if(res.ok){

        setPostedJobs(result);

       
        
    }
        
    } catch (error) {
        setMessage("Something wrong from our end !");

   
    }
    }
    showPostedJobs()
    },[userId])

    async function handleDelete(jobId){
      const confirmDelete = window.confirm("Are you sure you want to delete this job?");
      if (!confirmDelete) return;
      const token=localStorage.getItem("webtoken")
      const res=await fetch(`${apiUrl}/deleteJob/${jobId}`,{
        method:'DELETE',
        headers:{
          Authorization: `Bearer ${token}`,
            
                'Content-Type':'application/json'
        }
      })

      if(res.ok){
       
        alert("deleted successfully")
         setPostedJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));

      }
      else{
        alert("Something went wrong")
      }



    }

  





   

    return(
        <div className="min-h-screen w-full bg-gray-100 flex justify-center px-4 py-8">
           <div className="absolute inset-0 z-0 flex flex-1 justify-center items-center opacity-80  pointer-events-none">
          <Lottie 
            animationData={BgAnimation} 
            loop 
            autoplay 
            style={{ width: '100%', height: '100%',opacity: 0.5 }}
          />
        </div>
        <h3 className="pt-32 text-center font-semibold text-gray-700 text-2xl md:text-4xl">{message}</h3>

        {postedJobs.length===0?(
             <div>
        <h3 className="pt-32 text-center font-semibold text-gray-700 text-2xl md:text-4xl">
          No jobs posted by you
        </h3>
      </div> 
        ) 
        :
        (
        <div  className="w-full max-w-7xl flex flex-col items-center gap-y-12">
            <h2 className="text-xl md:text-2xl font-bold text-gray-700">Posted Jobs</h2>

             <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {postedJobs.map((job, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out flex flex-col gap-y-6 p-4"
            >
              
              <div className="flex justify-between items-start gap-x-6">
                <div className="text-left max-w-[60%]">
                  <p className="text-lg font-semibold text-gray-800">{job.jobtitle}</p>
                  <p className="text-sm text-gray-600">
                    at <span className="font-medium">{job.organisation}</span>
                  </p>
                </div>
              
                <div className="text-right">
                  <p className="text-md font-semibold text-gray-800">
                    {job.compensation.minAmount} - {job.compensation.maxAmount} {job.compensation.currency}
                  </p>
                  <p className="text-sm text-gray-600">{job.compensation.period}</p>
                </div>
              </div>
              <span className="font-medium text-gray-600">{job.description}</span>

              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-y-4 sm:gap-x-6">
                <div className="flex flex-col gap-y-2">
                  <p className="text-sm font-semibold text-gray-900">Skills Required:</p>
                  <div className="flex flex-wrap gap-2">
                    {job.skills &&
                      job.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-800 mt-2">{job.jobtype}</span>
                </div>

                
                <div className="text-sm font-semibold text-gray-800">
                  <p>{job.locationtype}</p>
                 {job.locationtype === 'On-Site' && <p>{job.location}</p>}
                </div>
              </div>
              
               <div className="w-full flex justify-center gap-12">
                <button  className="px-4 py-1 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-white hover:text-blue-500 transition" onClick={()=>handleApply(job._id)} >
                  
                  Applications 
                </button>
                <button  className="px-4 py-1 text-sm font-semibold text-white bg-red-500 rounded hover:bg-white hover:text-red-500 transition" onClick={()=>handleDelete(job._id)} >
                  Delete
                </button>
              </div>

              
              
            </div>
          ))}
        </div>





        </div>

        )
        
        
        
        

        
        
        
        }
        </div>
       
       
        
        
        
        
    )
}

export default JobsPosted;