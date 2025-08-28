import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";


function ChangePassword(){
    const navigate=useNavigate()
    const token=localStorage.getItem("webtoken")
    const [userId,setUserId]=useState('')
    const [isUserLoaded, setIsUserLoaded] = useState(false);
 useEffect(() => {
    if (!token) {
        navigate('/');
    } else {
        try {
            const decodedData = jwtDecode(token);
            if (decodedData && decodedData.id) {
                setUserId(decodedData.id);
                setIsUserLoaded(true);
            } else {
                console.error("Invalid token payload");
                
                navigate('/');
            }
        } catch (err) {
            console.error("Token decoding failed:", err);
            navigate('/');
        }
    }
}, [navigate, token]);



    const [passwordData,setPasswordData]=useState({
        oldPassword:"",
        newPassword:"",
        confirmPassword:"",
        
    })

    const [message,setMessage]=useState('')

    const handleChange=(e)=>{
        const {name,value}=e.target;
        setPasswordData({...passwordData,[name]:value})
    }

    const handleSubmit=async (e)=>{
        
        e.preventDefault()
        if(passwordData.newPassword!==passwordData.confirmPassword){
            setMessage("New Passwords not matching")
            return 
        }
        try {
            const payload={
            ...passwordData,
            user_id:userId
        }
        const res=await fetch('http://localhost:1200/changepassword',{
            method:'PUT',headers:{
                Authorization: `Bearer ${token}`,
            
                'Content-Type':'application/json'

            },
            body:JSON.stringify(payload)
        })
        
        setPasswordData({
             oldPassword:"",
        newPassword:"",
        confirmPassword:"",

        })
        if(res.ok){
            setMessage("Password Changed Sucessfully")
        }
        else{
            const errorData = await res.json();

            setMessage(errorData.message||"Can't Change Password Now")
        }


            
        } catch (error) {
            
            setMessage("Something is not right on the server")
            
        }
        
    }
   if (!isUserLoaded) {
        return (
            <div className="h-screen w-screen bg-radial-[at_45%_50%] from-[#d1e8e7] to-[#0db9c5] flex justify-center items-center">
                <p className="text-xl font-semibold">Loading...</p>
            </div>
        );
    }
    return(
         <div className="h-screen w-screen bg-radial-[at_45%_50%] from-[#d1e8e7] to-[#0db9c5] flex flex-col justify-center items-center">
            <h2 className="pb-4 text-2xl font-bold text-blue-500">Password Change</h2>
            <div  className="min-h-64 min-w-[45%] bg-white flex flex-col justify-center rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                 <form onSubmit={handleSubmit} className="flex flex-col p-12 font-medium text-gray gap-2">
                    <label>Old Password</label>
                    <input type="password" onChange={handleChange} name="oldPassword" value={passwordData.oldPassword} required className="border-blue-300 border-2 p-1"></input>
                    <label>New Password</label>
                    <input type="password" onChange={handleChange} name="newPassword" value={passwordData.newPassword} className="border-blue-300 border-2 p-1"></input>
                    <label>Confirm New Password</label>
                    <input type="password" onChange={handleChange} name="confirmPassword" value={passwordData.confirmPassword} className="border-blue-300 border-2 p-1"></input>
                    <button type="submit"  className="mt-2 m-auto min-w-[33%] h-8 bg-blue-500  text-white md:font-medium font-semibold rounded-md shadow-md transition-all">Change Password</button>
                    


                 </form>
                  <p className="m-auto mb-4 text-2xl font-bold text-blue-600">{message}</p>





            </div>

            



         </div>
    )

}

export default ChangePassword