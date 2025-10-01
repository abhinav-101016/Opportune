import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";



function JobPost(){
  
    const navigate=useNavigate()
   useEffect(() => {
    const token = localStorage.getItem("webtoken");
    if (!token) {
       
      navigate('/login');
    } else {
      try {
        const decoded = jwtDecode(token);
        if (decoded.role !== "poster") {
          navigate('/signup');
        }
        
      } catch (error) {
        console.error("Token decoding failed:", error.message);
        navigate('/login');
      }
    }
  }, [navigate]);




    const [jobData,setJobData]=useState({
        jobtitle:"",
        locationtype:"",
        jobtype:"",
        description:'',
        compensation:{
            minAmount:0,
            maxAmount:0,
            currency:'INR',
            period:'',
            isNegotiable:false,
           
        },
        skills:[],
        experience:'',
        location:'',
        deadline:''


    })
    const [message,setMessage]=useState('');
    const [skillsInput, setSkillsInput] = useState('');

    const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  if (name.includes('.')) {
    const [parent, child] = name.split('.');
    setJobData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: type === 'checkbox' ? checked : value,
      },
    }));
  } else {
     if (name === 'skills') {
            
            setSkillsInput(value);
        } else {
            setJobData({ ...jobData, [name]: value ||''});
        }
  }
};

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try {

            const token=localStorage.getItem("webtoken")
            const skillsArray = skillsInput.split(',').map(skill => skill.trim().toLowerCase()).filter(skill => skill !== '');

        const finalData = {
            ...jobData,
            skills: skillsArray
        };
             const res =await fetch('http://localhost:1200/postajob',
            {method:'POST'
            ,headers:{
            Authorization: `Bearer ${token}`,
            
            'Content-Type':'application/json'}
        
            ,body:JSON.stringify(finalData)})
            setJobData({
                     jobtitle: "",
                     locationtype: "",
                     jobtype: "",
                     description: "",
                     compensation: {
                     minAmount:0,
                     maxAmount:0,
                     currency: "INR",
                     period: "",
                     isNegotiable: false
                     },
                     skills: [],
                     experience: "",
                     location: "",
                     deadline: ""
                   });
                   setSkillsInput('');

             if (res.ok) {
            setMessage('Job Posted Sucessfully');
        } else {
            setMessage('Something Went Wrong maybe');
            console.log(res)
        }

            
        } catch (error) {
            setMessage("Something went wrong"+error.message)
        
        }
       
        

    }
  /*  return(
        <div className="h-[108vh] w-[100vw] bg-emerald-200 flex flex-col justify-center items-center ">
             <h2 className="pb-4 text-2xl font-bold text-blue-500">Create A Job</h2>
            <div className="min-h-64 min-w-[45%] bg-amber-100 flex flex-col justify-center rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <form onSubmit={handleSubmit} className="flex flex-col p-12 font-sm text-gray gap-1.5">
                    <label>Job Title</label>
                    <input type="text" onChange={handleChange} required name="jobtitle" value={jobData.jobtitle} className="border-blue-300 border-2 p-1 h-7"></input>
                    <label>Description</label>
                    <textarea onChange={handleChange} required name="description" value={jobData.description} className="border-blue-300 border-2 p-1 h-21"></textarea>
                    <label>Skills Required (comma-separated)</label>
                    <input type="text" required  name="skills" value={skillsInput||""} onChange={handleChange} className="border-blue-300 border-2 p-1 h-7"></input>



                    <label>Minimum Experience</label>
                    <select onChange={handleChange} name="experience" value={jobData.experience} required className="border-blue-300 border-2 p-1 h-7">
                        <option value="">Select</option>
                        <option value='Fresher'>Fresher</option>
                        <option value="1-3 years">1-3 Years</option>
                        <option value="4-8 years">4-8 Years</option>
                        <option value="8+ years">8+ Years</option>

                    </select>
                    
                    
                    <label>Job Type</label>
                    <select onChange={handleChange} name="jobtype" value={jobData.jobtype} required className="border-blue-300 border-2 p-1 h-7">
                        <option value="">Select</option>
                        <option value='Part-Time'>Part-Time</option>
                        <option value='Full-Time'>Full-Time</option>
                        <option value='Freelance'>Freelance</option>
                    </select>
                    <label>Location Type</label>
                    <select onChange={handleChange} name="locationtype" value={jobData.locationtype} required className="border-blue-300 border-2 p-1 h-7">
                        <option value="">Select</option>
                        <option value='On-Site'>On-Site</option>
                        <option value='Remote'>Remote</option>
                        
                    </select>
                    {(jobData.locationtype==='On-Site')&&
                    <div> <label>Location</label>
                    <input type="text" onChange={handleChange} name="location" value={jobData.location} className="border-blue-300 border-2 p-1 h-7">
                    </input></div>
                       
                    }
                    <fieldset className="border border-blue-300 p-2 rounded">
                        <legend>Compensation</legend>
                        <label>Min Amount: </label>
                        <input type="number" name="compensation.minAmount" required onChange={handleChange} value={jobData.compensation.minAmount} className="border-blue-300 border-2 p-1 h-7"></input>
                        <label>Max Amount: </label>
                        <input type="number" name="compensation.maxAmount" required onChange={handleChange} value={jobData.compensation.maxAmount} className="border-blue-300 border-2 p-1 h-7"></input>
                        <label>Currency</label>
                        <select  onChange={handleChange} name="compensation.currency" value={jobData.compensation.currency} required className="border-blue-300 border-2 p-1 h-7">
                            <option value="INR">INR</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                           
                        </select>
                        <label>Period</label>
                        <select onChange={handleChange} name="compensation.period" value={jobData.compensation.period} required className="border-blue-300 border-2 p-1 h-7">
                            <option value="">Select</option>
                            <option value="Hourly">Hourly</option>
                            <option value="Daily">Daily</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                            <option value="Annually">Annually</option>
                            <option value="Project-based">Project-based</option>
                        </select>
                         <input type="checkbox" name="compensation.isNegotiable" checked={jobData.compensation.isNegotiable} onChange={handleChange} className="border-blue-300 border-2 p-1 h-7"/>
                         <label>Is Negotiable ?</label>
    

                    </fieldset>
                    
                     

                   
                    <label>Deadline</label>
                    <input type="date" onChange={handleChange} min={new Date().toISOString().split('T')[0]} required value={jobData.deadline} name="deadline" className="border-blue-300 border-2 p-1 h-7"></input>
                    <button type="submit" className="mt-2 m-auto w-[30%] h-8 bg-blue-500  text-white font-semibold rounded-md shadow-md transition-all">Post Job</button>

                </form>
                 <p className="m-auto mb-4 text-2xl font-bold text-blue-600">{message}</p>
            </div>
        </div>
    )*/
   return (
  <div className="min-h-screen w-full  bg-gray-100 flex flex-col justify-center items-center py-8 px-4">
    <h2 className="pb-6 text-3xl font-bold text-gray-700">Create A Job</h2>
    <div className="w-full max-w-3xl  bg-white-200  bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-200 flex flex-col justify-center rounded-md shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <form onSubmit={handleSubmit} className="flex flex-col p-10 gap-y-4 text-gray-900">
        <div className="flex flex-col gap-1">
          <label>Job Title</label>
          <input type="text" name="jobtitle" placeholder="Enter job title" onChange={handleChange} required value={jobData.jobtitle} className="border-gray-300  border-2 p-2 rounded" />
        </div>

        <div className="flex flex-col gap-1">
          <label>Description</label>
          <textarea name="description" placeholder="Enter job description" onChange={handleChange} required value={jobData.description} className="border-gray-300  border-2 p-2 rounded h-24 resize-none" />
        </div>

        <div className="flex flex-col gap-1">
          <label>Skills Required (comma-separated)</label>
          <input type="text" name="skills" placeholder="e.g., Web Development, Graphic Design" required value={skillsInput || ""} onChange={handleChange} className="border-gray-300 border-2 p-2 rounded" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label>Minimum Experience</label>
            <select name="experience" onChange={handleChange} value={jobData.experience} required className="border-gray-400  border-1 p-2 rounded">
              <option value="">Select</option>
              <option value="Fresher">Fresher</option>
              <option value="1-3 years">1-3 Years</option>
              <option value="4-8 years">4-8 Years</option>
              <option value="8+ years">8+ Years</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label>Job Type</label>
            <select name="jobtype" onChange={handleChange} value={jobData.jobtype} required className="border-gray-400  border-1 p-2 rounded">
              <option value="">Select</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label>Location Type</label>
            <select name="locationtype" onChange={handleChange} value={jobData.locationtype} required className="border-gray-400  border-1 p-2 rounded">
              <option value="">Select</option>
              <option value="On-Site">On-Site</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          {jobData.locationtype === 'On-Site' && (
            <div className="flex flex-col gap-1">
              <label>Location</label>
              <input type="text" name="location" placeholder="City, State" onChange={handleChange} value={jobData.location} className="border-gray-300 border-2 p-2 rounded" />
            </div>
          )}
        </div>

        <fieldset className="border border-gray-300 p-4 rounded space-y-3 mt-4">
          <legend className="text-gray-300 font-semibold">Compensation</legend>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label>Min Amount</label>
              <input type="number" name="compensation.minAmount" required onChange={handleChange} value={jobData.compensation.minAmount} className="border-gray-300 border-2 p-2 rounded" />
            </div>

            <div className="flex flex-col gap-1">
              <label>Max Amount</label>
              <input type="number" name="compensation.maxAmount" required onChange={handleChange} value={jobData.compensation.maxAmount} className="border-gray-300 border-2 p-2 rounded" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label>Currency</label>
              <select name="compensation.currency" onChange={handleChange} value={jobData.compensation.currency} required className="border-gray-400  border-1 p-2 rounded">
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label>Period</label>
              <select name="compensation.period" onChange={handleChange} value={jobData.compensation.period} required className="border-gray-400  border-1 p-2 rounded">
                <option value="">Select</option>
                <option value="Hourly">Hourly</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Annually">Annually</option>
                <option value="Project-based">Project-based</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" name="compensation.isNegotiable" checked={jobData.compensation.isNegotiable} onChange={handleChange} className="accent-blue-500" />
            <label>Is Negotiable?</label>
          </div>
        </fieldset>

        <div className="flex flex-col gap-1 mt-4">
          <label>Deadline</label>
          <input type="date" name="deadline" min={new Date().toISOString().split('T')[0]} required value={jobData.deadline} onChange={handleChange} className="border-gray-300/50  border-1 p-2 rounded" />
        </div>

        <button type="submit" className="mt-2 m-auto w-[80%] sm:w-[30%] h-10 text-lg   md:h-10 bg-gradient-to-r from-[#03a9f4] via-[#3caee3] to-[#0184c1] hover:bg-gradient-to-br focus:ring-[#76c7ed] dark:focus:ring-[#03a9f4] text-white font-semibold rounded-md shadow-md transition-all">Post Job</button>
        
      </form>

      <p className="m-auto mb-6 text-xl font-semibold text-gray-700">{message}</p>
    </div>
  </div>
);

}

export default JobPost