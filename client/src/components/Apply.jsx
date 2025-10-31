import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate , useSearchParams} from "react-router-dom";
import Lottie from "lottie-react";
import BgAnimation from '../animations/bgAni.json'




const Apply = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
   const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");

  useEffect(() => {
    const token = localStorage.getItem("webtoken");
    if (!token) return navigate("/login");
    const decodedData = jwtDecode(token);
    if (decodedData.role !== "seeker") return navigate("/");
  }, [navigate]);

  const [fullData, setFullData] = useState({});
  ;
  const token = localStorage.getItem("webtoken");
  const decodedData = jwtDecode(token);
  const personId = decodedData.id;


  const [formData, setFormData] = useState({
    jobId: jobId,
    personId: personId,
    whyhire: "",
    startimmediately: "",
    resume: null
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFormData({ ...formData, resume: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("jobId", jobId);
    formDataToSend.append("personId", personId);
    formDataToSend.append("whyhire", formData.whyhire);
    formDataToSend.append("startimmediately", formData.startimmediately);
    formDataToSend.append("resume", formData.resume);
    try {
      const token = localStorage.getItem("webtoken");
      const res = await fetch(`${apiUrl}/applicationsubmitted`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend
      });
      if (res.ok) {
        alert("Application submitted successfully!");
        navigate("/");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to submit application");
      }
    } catch (error) {
      alert("Something went wrong!");
    }
  };

  useEffect(() => {
    const getJobData = async () => {
      const token = localStorage.getItem("webtoken");
      try {
        const res = await fetch(`${apiUrl}/applydata?jobId=${jobId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
        });
        const result = await res.json();
        if (res.ok) setFullData(result);
      } catch (error) {}
    };
    getJobData();
  }, [jobId]);

  return (
    <div className="min-h-screen w-full bg-radial-[at_45%_50%] bg-gray-100 flex justify-center items-center px-4 py-8">
       <div className="absolute inset-0 z-0 flex flex-1 justify-center items-center opacity-80  pointer-events-none">
          <Lottie 
            animationData={BgAnimation} 
            loop 
            autoplay 
            style={{ width: '100%', height: '100%',opacity: 0.5 }}
          />
        </div>
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6 md:p-10">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2 text-center">Job Application Form</h2>
        <h2 className="text-lg md:text-xl font-semibold mb-8 text-blue-500 text-center">
          <span>{fullData.jobtitle}</span> at <span>{fullData.organisation}</span>
        </h2>
        <form className="space-y-6 text-gray-900" onSubmit={handleSubmit}>
          <div>
            <label className="block  text-sm md:text-base mb-2">Why should we hire you?</label>
            <textarea
              name="whyhire"
              required
              value={formData.whyhire}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-gray-700"
              rows="4"
              placeholder="Explain why you’re the best fit..."
            />
          </div>
          <div>
            <label className="block  text-sm md:text-base mb-2">Are you able to start immediately?</label>
            <select
              name="startimmediately"
              required
              value={formData.startimmediately}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-gray-700"
            >
              <option value="">Select an option</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div>
            <label className="block  text-sm md:text-base mb-2">Upload Resume</label>
            <input
              type="file"
              name="resume"
              accept=".pdf,.doc,.docx"
              required
              onChange={handleFileChange}
              className="w-full border rounded-lg p-3 text-sm md:text-base focus:outline-none  focus:ring-1 focus:ring-gray-700"
            />
          </div>
          <div className="flex justify-center">
            <button type="submit" className="mt-2 m-auto w-[70%] sm:w-[30%] h-10 text-lg bg-gradient-to-r from-[#03a9f4] via-[#3caee3] to-[#0184c1] hover:bg-gradient-to-br focus:ring-2 focus:outline-[#03a9f4] focus:ring-[#76c7ed] dark:focus:ring-[#03a9f4] text-white font-semibold rounded-md shadow-md transition-all">Submit Application</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Apply;
