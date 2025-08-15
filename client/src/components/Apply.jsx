import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Apply=()=>{
    const navigate=useNavigate()
    useEffect(()=>{
        const token=localStorage.getItem("webtoken")
        if(!token){
           return  navigate("/login")

        }
        const decodedData=jwtDecode(token)
        if(decodedData.role!=="seeker"){
             return navigate('/')


        }

       

    },[navigate])



    const [jobData,setJobData]=useState('')

    const jobId=localStorage.getItem("selectedJobId")

    useEffect( ()=>{const getJobData=async ()=>{
        const token=localStorage.getItem("webtoken")
        try {
            const res=await fetch(`http://localhost:1200/applydata?jobId=${jobId}`,{
                method:"GET",
                headers:{ Authorization: `Bearer ${token}`,
            
                'Content-Type':'application/json'},
                
            })
            const result=await res.json()
            if(res.ok){
                setJobData(result)

            }
            
        } catch (error) {

            
        }


    }
getJobData()},[])
   



    return(
        <div className="min-h-screen w-full bg-emerald-200 flex justify-center items-center px-4 py-8">
            <div className="h-[70vh] min-w-[65%] bg-emerald-100 rounded-md flex flex-col justify-center items-center">
               <h2 className="text-md md:text-2xl  text-gray-700">Application Form</h2>
                <h2 className="text-sm md:text-xl text-blue-500 flex flex-col sm:flex-row sm:items-center sm:justify-center text-center"> <span>{jobData.jobtitle}</span>
  <span className="sm:ml-1">at {jobData.organisation}</span></h2>
               <div>
              



               </div>

            </div>
            

        </div>
   )

}
export default Apply