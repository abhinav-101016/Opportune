
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import BgAnimation from '../animations/bgAni.json'





function BrowseJobs(){
    const navigate=useNavigate()

    const [jobs,setJobs]=useState("")
    const handleApply=(jobId)=>{
      
      return navigate(`/apply?jobId=${jobId}`);
    }
    

    useEffect(()=>{
        const token=localStorage.getItem("webtoken")
        if(!token){
           return navigate('/login')

        }
        const decodedData=jwtDecode(token)
        if(decodedData.role!=="seeker"){
             return navigate('/')


        }



    },[navigate])
    useEffect(()=>{
         async function showJobs(){
         try {
         const token=localStorage.getItem("webtoken")

    const res =await fetch('http://localhost:1200/browsejobs',{method:'GET',
        headers:{
             Authorization: `Bearer ${token}`,
            
                'Content-Type':'application/json'
            
        }
    })
    const result=await res.json()
    if(res.ok){
        setJobs(result)
        
    }
        
    } catch (error) {
   
    }
    }
    showJobs()
    },[])



   
   
   
   return (
  <div className="min-h-screen w-full bg-gray-100 flex justify-center px-4 py-8">
     <div className="absolute inset-0 z-0 flex flex-1 justify-center items-center opacity-80  pointer-events-none">
          <Lottie 
            animationData={BgAnimation} 
            loop 
            autoplay 
            style={{ width: '100%', height: '100%',opacity: 0.5 }}
          />
        </div>
    {jobs.length === 0 ? (
      <div>
        <h3 className="pt-32 text-center font-semibold text-gray-700 text-2xl md:text-4xl">
          No Jobs Found Matching Your Skills
        </h3>
      </div>
    ) : (
      <div className="w-full max-w-7xl flex flex-col items-center gap-y-12">
        <h2 className="text-xl md:text-2xl font-bold text-gray-700">Available Jobs</h2>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, index) => (
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

              
              <div className="w-full flex justify-center">
                <button  className="px-4 py-1 text-sm font-semibold text-white bg-gradient-to-r from-[#03a9f4] via-[#3caee3] to-[#0184c1] hover:bg-gradient-to-br focus:ring-2 focus:outline-[#03a9f4] focus:ring-[#76c7ed] dark:focus:ring-[#03a9f4]   rounded hover:bg-blue-700 transition" onClick={()=>handleApply(job._id)} >
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

}
export default BrowseJobs