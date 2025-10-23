import { useState,useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate,useSearchParams } from "react-router-dom";
import Lottie from "lottie-react";
import BgAnimation from '../animations/bgAni.json'


function Applications(){
    const [message,setMessage]=useState("");
    const[applicationData,setApplicationData]=useState([]);
    const navigate=useNavigate();
    const [searchParams]=useSearchParams();
    const jobId=searchParams.get("jobId");
    useEffect(()=>{
        const token=localStorage.getItem('webtoken');
        if(!token){
            return navigate('/login');
        }
        const decodedData=jwtDecode(token);
        if (decodedData.role !== "poster") return navigate("/");


    },[navigate]);

    useEffect(() => {
      if(!jobId) return;

    const getApplications = async () => {
      const token = localStorage.getItem("webtoken");
      try {
        const res = await fetch(`http://localhost:1200/applications?jobId=${jobId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
        });
        const result = await res.json();
       
        if (res.ok){ setApplicationData(result);
         
                    
 }
      } catch (error) {
       
       
      }
    };
    getApplications();
  }, [jobId]);

  

const  handleSubmit=async(id,status)=>{
  const token = localStorage.getItem("webtoken");
  const res=await fetch(`http://localhost:1200/status?id=${id}`,
    {
      method:"PUT",
      headers:{ Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body:JSON.stringify({ status1: status })
     
    }
  )
  if(res.ok){
    setMessage("Done");
    const result = await res.json(); 
    setApplicationData(prev=>prev.map(app=>app._id===id?{...app,status:status}:app))
  }







}



  
  







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
    {applicationData.length === 0 ? (
      <div>
        <h3 className="pt-32 text-center font-semibold text-gray-700 text-2xl md:text-4xl">
          No Applications Found
        </h3>
      </div>
    ) : (
      <div className="w-full max-w-7xl flex flex-col items-center gap-y-12">
        <h2 className="text-xl md:text-2xl font-bold text-gray-700">
          {applicationData.length} {applicationData.length === 1 ? "Application" : "Applications"}
        </h2>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {applicationData.map((app, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out flex flex-col gap-y-4 p-6"
            >
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-gray-800">{app.name}</p>
                  <p className="text-sm text-gray-600">{app.experience} years experience</p>
                </div>
                {app.startimmediately === "true" && (
                  <span className="px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded-full">
                    Ready to Start
                  </span>
                )}
                <span className={`px-2 py-1 text-xs font-semibold text-white rounded-md ${app.status === "accepted"    ? "bg-green-500"    : app.status === "pending"    ? "bg-yellow-700"
      : app.status === "rejected"
      ? "bg-red-500"
      : "bg-gray-400"
  }`}>{app.status}</span> 

              </div>
              
             
              <div>
                <p className="text-gray-700 text-sm">{app.whyhire}</p>
              </div>

             
              <div className="flex flex-col gap-y-1">
                <p className="text-sm font-semibold text-gray-900">Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {app.skills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-800 text-xs md:text-sm font-medium px-3 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

             
              <div className="flex justify-between items-center mt-4">
                <a
                  href={app.resume}
                  
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#03a9f4] via-[#3caee3] to-[#0184c1] hover:bg-gradient-to-br rounded shadow-md transition"
                >
                  View Resume
                </a>
              { app.status==="rejected"&&(<div className="flex justify-between items-center gap-5"><button
                  className="px-4 py-2 text-sm font-semibold text-white bg-green-500 hover:bg-green-600 rounded shadow-md transition"
                  onClick={() => handleSubmit(app._id,"accepted")}
                >
                  Accept
                </button>
                <button
                className="px-4 py-2 text-sm font-semibold text-white bg-yellow-700 hover:bg-yellow-800 rounded shadow-md transition"
                  onClick={() => handleSubmit(app._id,"pending")}
                >
                  Mark Pending
                </button></div>
              )

                }
                 { app.status==="accepted"&&(<div className="flex justify-between items-center gap-5"><button
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded shadow-md transition"
                  onClick={() => handleSubmit(app._id,"rejected")}
                >
                  Reject
                </button>
                <button
                className="px-4 py-2 text-sm font-semibold text-white  bg-yellow-700 hover:bg-yellow-800 rounded shadow-md transition"
                  onClick={() => handleSubmit(app._id,"pending")}
                >
                  Mark Pending
                </button></div>)}

                  { app.status=="pending"&&(<div className="flex justify-between items-center gap-5"><button
                  className="px-4 py-2 text-sm font-semibold text-white bg-green-500 hover:bg-green-600 rounded shadow-md transition"
                  onClick={() => handleSubmit(app._id,"accepted")}
                >
                  Accept
                </button>
                <button
                className="px-4 py-2 text-sm font-semibold text-white  bg-red-500 hover:bg-red-600 rounded shadow-md transition"
                  onClick={() => handleSubmit(app._id,"rejected")}
                >
                  Reject
                </button></div>)}
                 
                 
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

}

export default Applications