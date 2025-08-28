import { useState,useEffect } from "react"
import { jwtDecode } from "jwt-decode"
import { NavLink, useNavigate } from "react-router-dom"

 function  Dashboard(){
    const navigate=useNavigate()
    const [userId,setUserId]=useState('')
    const [message,setMessage]=useState('')
    const [role,setRole]=useState('')
    const [posterData,setPosterData]=useState({
        name:"",
        email:"",
        mob:"",
        role:"",
        organisation:"",
        position:"",
        jobposted:"",
        membersince:""



    })
    const [seekerData,setSeekerData]=useState({
        name:"",
        email:"",
        mob:"",
        role:"",
        skills:[],
        
        experience:"",
        jobsApplied:"",
        membersince:""

    })


    useEffect(()=>
        { const token= localStorage.getItem("webtoken");
    if(!token){

       
        setMessage("Please Sign Up or Login !")
        setTimeout(()=>{
             navigate('/login')
            },500)
            return 

    }
    try {
        const decodedData= jwtDecode(token)
        if(!decodedData){
            setMessage("Unauthorized")
        setTimeout(()=>{
             navigate('/')
            },500)
            return 
            
        }
        setUserId(decodedData.id);
        setRole(decodedData.role)
        

        
    } catch (error) {
        
        setMessage("Invalid Token")
         setTimeout(()=>{
             navigate('/')
            },500)

        
    }

       },[navigate])
    useEffect( ()=>{

        if (!userId) return;
        const fetchDashboardData=async()=>{
            const token=localStorage.getItem("webtoken")
              try {


             const res=await fetch(`http://localhost:1200/dashboard?userId=${userId}`,{
            method:'GET',
            headers:{ Authorization: `Bearer ${token}`,
            
            'Content-Type':'application/json'

            },
            
        })
         const data = await res.json();
         if(res.ok &&role==="poster"){
            const dateObj=new Date(data.membersince);
            const formattedDate=dateObj.toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});
            
            setPosterData({
                name:data.name,
                email:data.email,
                mob:data.mob,
                role:data.role,
                organisation:data.organisation,
                position:data.position,
                jobposted:data.jobposted,
                membersince:formattedDate
            })
            

            
         }
         else if(res.ok &&role==="seeker"){
             const dateObj=new Date(data.membersince);
            const formattedDate=dateObj.toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});
           setSeekerData({
                name:data.name,
                email:data.email,
                mob:data.mob,
                role:data.role,
                skills:data.skills,
                experience:data.experience,
                jobsApplied:data.jobsApplied,
                membersince:formattedDate
 
           })
           
           
          

         }
         else{
            setMessage(data.message)
         }
            
        } catch (error) {
            setMessage(error.message)
            
        }

        }
        fetchDashboardData()
      
       
       
        



    },[userId])
    function handleLogout(e){
        localStorage.removeItem("webtoken");
        navigate('/')
        window.location.reload();

    }
   

    
    function handleEdit(e){

    }


   
    

  
    return(<div className="min-h-screen w-[100vw] bg-radial-[at_45%_50%] from-[#d1e8e7] to-[#0db9c5] flex flex-col gap-y-32 justify-center items-center">
        <h2 className="mt-[-14px] font-bold text-5xl text-gray-700">Dashboard</h2>
        <h3 className="font-bold text-5xl text-gray-700">{message}</h3>

        {(role==="poster"&&
        
        
        <div className="max-h-[75%] max-w-[80%] grid  grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white min-h-[45vh] min-w-[25vw] rounded-lg shadow-md hover:shadow-2xl  transform hover:scale-105 transition duration-300 ease-in-out flex 
        flex-col items-center gap-y-12">
                <h3 className="text-center pt-4 text-2xl font-semibold">Personal Details</h3>
                <div className="grid grid-cols-2 gap-x-2 font-semibold">
                <p className="text-[10px] md:text-sm  p-2 ml-5">Name: {posterData.name.toUpperCase()}</p>
                <p  className="text-[10px] md:text-sm p-2 ml-5">Role: {posterData.role}</p>
                <p  className="text-[10px] md:text-sm p-2 ml-5">Email: {posterData.email}</p>
                <p  className="text-[10px] md:text-sm p-2 ml-5">Mob No: {posterData.mob}</p>
                <p  className="text-[10px] md:text-sm p-2 ml-5">Organisation: {posterData.organisation}</p>
                <p  className="text-[10px] md:text-sm p-2 ml-5">Position: {posterData.position}</p>
               
                <p className="text-[10px] md:text-sm p-2 ml-5">Total Jobs Posted: {posterData.jobposted}</p>
                <p  className="text-[10px] md:text-sm p-2 ml-5">Profile Created: {posterData.membersince}</p>
                </div>

            </div>
             
              <div className="bg-white min-h-[40vh] min-w-[25vw] rounded-lg shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out ">
                <h3 className="text-center pt-4 text-2xl font-semibold">Manage Account</h3>
                <div className="flex flex-col justify-center items-center gap-y-4 pt-14">
                <div className=" cursor-pointer" onClick={handleEdit}>Edit Profile</div>
                <div><NavLink to="/changepassword">Change Password</NavLink></div>
                <div onClick={handleLogout} className='h-8 w-24 flex justify-center items-center text-center rounded-md bg-red-500 text-white  cursor-pointer hover:bg-white hover:text-red-500'>Log Out</div>
                <NavLink to='/deleteprofile'><div  className="cursor-pointer h-8 w-32 bg-red-500 text-white hover:bg-white hover:text-red-500 rounded-md text-center pt-1">Delete Account</div></NavLink>
                </div>


            </div>
              

        </div>)
        
        
        
        
        
        
        ||(role==="seeker"&&<div className="max-h-[75%] max-w-[80%] grid  grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white min-h-[45vh] min-w-[25vw] rounded-lg shadow-md hover:shadow-2xl  transform hover:scale-105 transition duration-300 ease-in-out flex 
        flex-col items-center gap-y-12">

             <h3 className="text-center pt-4 text-2xl font-semibold">Personal Details</h3>
                <div className="grid grid-cols-2 gap-x-2 font-semibold">
                <p className="text-[10px] md:text-sm  p-2 ml-5">Name: {seekerData.name.toUpperCase()}</p>
                <p  className="text-[10px] md:text-sm p-2 ml-5">Role: {seekerData.role}</p>
                <p  className="text-[10px] md:text-sm p-2 ml-5">Email: {seekerData.email}</p>
                <p  className="text-[10px] md:text-sm p-2 ml-5">Mob No: {seekerData.mob}</p>
                <p  className="text-[10px] md:text-sm p-2 ml-5">Work Experience: {seekerData.experience} Years</p>
                <p  className="text-[10px] md:text-sm p-2 ml-5">Jobs Applied: {seekerData.jobsApplied} </p>
                <p> <p className="text-[10px] md:text-sm p-2 ml-5">Skills: </p>
                <div className="flex flex-wrap gap-2 px-2 py-2">{Array.isArray(seekerData.skills)&&seekerData.skills.length>0 ?(
                    seekerData.skills.map((skill,index)=>(
                        <span key={index} className="px-3 py-1 bg-emerald-300  rounded-full md:text-sm  text-[10px] ">{skill}</span>

                    ))
                ):(<p>No skills are available</p>)}</div>
                </p>
                
                <p  className="text-[10px] md:text-sm p-2 ml-5">Profile Created: {seekerData.membersince}</p>

                </div>
                
                 </div>
                   <div className="bg-white min-h-[40vh] min-w-[25vw] rounded-lg shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out ">
                <h3 className="text-center pt-4 text-2xl font-semibold">Manage Account</h3>
                <div className="flex flex-col justify-center items-center gap-y-4 pt-14">
                <div className=" cursor-pointer" onClick={handleEdit}>Edit Profile</div>
                <div><NavLink to="/changepassword">Change Password</NavLink></div>
                <div onClick={handleLogout} className='h-8 w-24 flex justify-center items-center text-center rounded-md bg-red-500 text-white  cursor-pointer hover:bg-white hover:text-red-500'>Log Out</div>
                <NavLink to='/deleteprofile'><div  className="cursor-pointer h-8 w-32 bg-red-500 text-white hover:bg-white hover:text-red-500 rounded-md text-center pt-1">Delete Account</div></NavLink>
                </div>


            </div>
              


           


          
            
            









        </div>)}
        </div>
        
    )
}
export default Dashboard