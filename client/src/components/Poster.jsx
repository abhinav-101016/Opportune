import { useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";


function Poster(){

    const isAllowed=(localStorage.getItem('signupComplete'))
    const isSeeker=(localStorage.getItem('isSeeker'));
    const navigate=useNavigate()
    const [message,setMessage]=useState('')

    useEffect(()=>{
        if(!isAllowed){
            navigate('/signup')
        }
        else if(isAllowed && isSeeker){
            navigate('/seeker-complete-profile')

        }
    },[])


   
    const [posterData,setPosterData]=useState({
        organisation:'',
        position:'',
        industry:'',
        companySize:'',
        email:''
    })


     useEffect(()=>{
        const email=localStorage.getItem('email')
        if(email){
            setPosterData((prev)=>({ ...prev, email }))
        }
     },[])



    function handleChange(e){
        setPosterData({...posterData,[e.target.name]:e.target.value})

    }

     async function handleSubmit(e){
        try {
            e.preventDefault()
        const res =await fetch('http://localhost:1200/poster',{
            method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(posterData)
        })

        if(res.ok){
            setMessage("Profile Completed Sucessfully")
        }
        else{
            setMessage("Something Went Wrong")
        }
            
        } catch (error) {
            setMessage("Something broke: " + error.message);
            
        }
        
    }



    return(
    <div className="h-screen w-screen bg-emerald-200 flex flex-col justify-center items-center">
        <h2 className="pb-4 text-2xl font-bold text-blue-500">Sign-Up</h2>
        <div className="min-h-64 min-w-[45%] bg-emerald-100 flex flex-col justify-center rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <form onSubmit={handleSubmit} className="flex flex-col p-12 font-medium text-gray gap-2">
                <label>Organisation Name</label>
                <input type="text" required onChange={handleChange} name="organisation" value={posterData.organisation} className="border-blue-300 border-2 p-1"></input>
                <label>Position</label>
                <input type="text" required onChange={handleChange} name="position" value={posterData.position} className="border-blue-300 border-2 p-1"></input>
                
                <select name="industry" value={posterData.industry} onChange={handleChange} required className="border-blue-300 border-2 p-1">
                    <option value="">Select Industry</option>
                    <option value="IT">IT</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Media">Media</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Other">Other</option>
                </select>

                <select name="companySize" value={posterData.companySize} onChange={handleChange} required className="border-blue-300 border-2 p-1">
                     <option value="">Select Company Size</option>
                     <option value="1-10">1-10</option>
                     <option value="11-50">11-50</option>
                     <option value="51-200">51-200</option>
                     <option value="201-500">201-500</option>
                     <option value="501-1000">501-1000</option>
                     <option value="1000+">1000+</option>
                </select>
                 <button type="submit" className="mt-2 m-auto w-[30%] h-8 bg-blue-500  text-white font-semibold rounded-md shadow-md transition-all">Submit</button>

            </form>
            <p className="m-auto mb-4 text-2xl font-bold text-blue-600">{message}</p>
            
        </div>
    </div>
    )
}

export default Poster
