
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";




function BrowseJobs(){
    const navigate=useNavigate()

    const [jobs,setJobs]=useState("")
    const handleApply=(jobId)=>{
      localStorage.setItem("selectedJobId",jobId);
      return navigate('/apply')
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
  <div className="min-h-screen w-full bg-radial-[at_45%_50%] from-[#d1e8e7] to-[#0db9c5] flex justify-center px-4 py-8">
    {jobs.length === 0 ? (
      <div>
        <h3 className="pt-32 text-center font-semibold text-blue-600 text-2xl md:text-4xl">
          No Jobs Found Matching Your Skills
        </h3>
      </div>
    ) : (
      <div className="w-full max-w-7xl flex flex-col items-center gap-y-12">
        <h2 className="text-xl md:text-2xl font-bold text-blue-500">Available Jobs</h2>

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

                {/* Location */}
                <div className="text-sm font-semibold text-gray-800">
                  <p>{job.locationtype}</p>
                  {job.locationtype === 'On-Site' && <p>{job.location}</p>}
                </div>
              </div>

              
              <div className="w-full flex justify-center">
                <button  className="px-4 py-1 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition" onClick={()=>handleApply(job._id)} >
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