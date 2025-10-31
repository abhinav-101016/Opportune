
import { useState,useEffect } from "react";

import  {jwtDecode}  from "jwt-decode";
import { useNavigate,useSearchParams } from "react-router-dom";
import Lottie from "lottie-react";
import BgAnimation from '../animations/bgAni.json'


const SeekerApplications=()=>{

    const apiUrl = import.meta.env.VITE_API_URL;
    const [message,setMessage]=useState('');
    
    const [seekerApplication,setSeekerApplication]=useState([]);
    const [showConfirm,setShowConfirm]=useState(false);
    const [selectedId,setSelectedId]=useState(null);
    const navigate=useNavigate();
  

    useEffect(()=>{
        const token=localStorage.getItem("webtoken");
        if(!token){
            navigate('/login');
            return ;
        }
        
       let decodedData;
    try {
      decodedData = jwtDecode(token);
    } catch (err) {
      console.error("Invalid or expired token:", err);
      localStorage.removeItem("webtoken");
      navigate("/login");
      return;
    }
    if(decodedData.role!=="seeker"){
        navigate("/");
        return ;
    }
   

    },[navigate]);

    useEffect(()=>{
        
        const getApplications=async()=>{
            const token=localStorage.getItem("webtoken");
            try {
                const res = await fetch(`${apiUrl}/api/seekerapplications`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
        });
         const result = await res.json();
       
        if (res.ok){ setSeekerApplication(result);}
         
                
                
            } catch (error) {
                
            }
            

        };
        getApplications();


    },[apiUrl]);

    const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

 const handleWithdraw = async () => {
  const token = localStorage.getItem("webtoken");
  try {
    const res = await fetch(`${apiUrl}/api/withdraw/${selectedId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      setSeekerApplication((prev) =>
        prev.filter((app) => app._id !== selectedId)
      );
      setShowConfirm(false);
      alert(" Application withdrawn successfully!");
    } else if (res.status === 403) {
      alert("You are not authorized to withdraw this application.");
    } else {
      alert(" Failed to withdraw. Please try again.");
    }
  } catch (error) {
    console.error("Error withdrawing application:", error);
    alert("Something went wrong. Please try again later.");
  }
};









 return (
    <div className="min-h-screen w-full bg-gray-100 flex justify-center px-4 py-8 relative">
      
      <div className="absolute inset-0 z-0 flex flex-1 justify-center items-center opacity-80 pointer-events-none">
        <Lottie
          animationData={BgAnimation}
          loop
          autoplay
          style={{ width: "100%", height: "100%", opacity: 0.5 }}
        />
      </div>

      {seekerApplication.length === 0 ? (
        <div>
          <h3 className="pt-32 text-center font-semibold text-gray-700 text-2xl md:text-4xl">
            No Active Applications
          </h3>
        </div>
      ) : (
        <div className="w-full max-w-7xl flex flex-col items-center gap-y-12 z-10">
          <h2 className="text-xl md:text-2xl font-bold text-gray-700">
            {seekerApplication.length}{" "}
            {seekerApplication.length === 1
              ? "Active Application"
              : "Active Applications"}
          </h2>

          
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {seekerApplication.map((job, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out flex flex-col gap-y-5 p-6"
              >
                
                <div className="flex justify-between items-start gap-x-4">
                  <div className="text-left max-w-[65%]">
                    <p className="text-lg font-semibold text-gray-800">
                      {job.jobId.jobtitle}
                    </p>
                    <p className="text-sm text-gray-600">
                      at{" "}
                      <span className="font-medium">
                        {job.jobId.organisation}
                      </span>
                    </p>
                  </div>

                  <span
                    className={`px-2 py-1 text-xs font-semibold text-white rounded-md ${
                      job.status === "accepted"
                        ? "bg-green-500"
                        : job.status === "pending"
                        ? "bg-yellow-700"
                        : job.status === "rejected"
                        ? "bg-red-500"
                        : "bg-gray-400"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Why should we hire you?
                  </p>
                  <p className="text-gray-700 text-sm">{job.whyhire}</p>
                </div>

               
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-y-3 sm:gap-x-6 text-sm font-semibold text-gray-800">
                  <span>{job.jobId.jobtype}</span>
                  <div className="text-right">
                    <p>{job.jobId.locationtype}</p>
                    {job.jobId.locationtype === "On-Site" && (
                      <p>{job.jobId.location}</p>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  <span className="font-medium text-gray-700">
                    Applied on:
                  </span>{" "}
                  {formatDate(job.date)}
                </div>

               
                <div className="w-full flex justify-between items-center mt-3">
                  <a
                    href={job.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    
                    className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#03a9f4] via-[#3caee3] to-[#0184c1] hover:bg-gradient-to-br rounded shadow-md transition"
                  >
                    View Resume
                  </a>

                <button
                    onClick={() => {
                     setSelectedId(job._id);
                     setShowConfirm(true);
                   }}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-red-400 hover:bg-red-500 rounded-md shadow-sm transition transform hover:scale-105"
                >
                  Withdraw
                </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {showConfirm && (
  <div className="fixed inset-0 bg-gray-100 bg-opacity-60 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Withdraw Application
      </h2>
      <p className="text-gray-600 text-sm mb-5">
        Are you sure you want to withdraw your application? This action cannot
        be undone.
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={handleWithdraw}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Yes, Withdraw
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};
export default SeekerApplications;
