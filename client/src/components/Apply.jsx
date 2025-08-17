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



    const [fullData,setFullData]=useState({})
    
   
    const jobId=localStorage.getItem("selectedJobId")
    const [formData,setFormData]=useState(
        {
            whyhire:"",
            startimmediately:false,
            upload:""

        }
    )
    const handleChange=()=>{

    }
    const handleSubmit=()=>{

    }
   
    useEffect( ()=>{
        
        const getJobData=async ()=>{
        const token=localStorage.getItem("webtoken")
        try {
            const res=await fetch(`http://localhost:1200/applydata?jobId=${jobId}`,{
                method:"GET",
                headers:{ Authorization: `Bearer ${token}`,
            
                'Content-Type':'application/json'},
                
            })
            const result=await res.json()
            if(res.ok){
                
                setFullData(result)
                
                
                    
                

            }
            
        } catch (error) {
           

            
        }


    }
getJobData()},[jobId])



   



  return (
  <div className="min-h-screen w-full bg-emerald-200 flex justify-center items-center px-4 py-8">
    <div className="w-full max-w-2xl bg-emerald-100 shadow-lg rounded-2xl p-6 md:p-10">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2 text-center">
        Job Application Form
      </h2>
       <h2 className="text-lg md:text-xl font-semibold  mb-8 text-blue-500 text-center">
        <span>{fullData.jobtitle}</span> at  <span>{fullData.organisation}</span>
      </h2>

      <form className="space-y-6">
        
        <div>
          <label className="block text-gray-700 text-sm md:text-base mb-2">
            Why should we hire you?
          </label>
          <textarea
            className="w-full border rounded-lg p-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-emerald-400"
            rows="4"
            placeholder="Explain why you’re the best fit..."
          />
        </div>

        
        <div>
          <label className="block text-gray-700 text-sm md:text-base mb-2">
            Are you able to start immediately?
          </label>
          <select className="w-full border rounded-lg p-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-emerald-400">
            <option value="">Select an option</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

       
        <div>
          <label className="block text-gray-700 text-sm md:text-base mb-2">
            Upload Resume
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="w-full border rounded-lg p-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full md:w-auto bg-blue-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition"
          >
            Submit Application
          </button>
        </div>
      </form>
    </div>
  </div>
);


}
export default Apply