import { useEffect, useState } from "react";
import { NavLink } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../Context/LoginContext";




function Header(){
    const navigate=useNavigate()
    const {isLoggedIn}=useLogin()
    const [role,setRole]=useState('')
    const [token,setToken]=useState('')
    const [name,setName]=useState('')
    const [open,setOpen]=useState(false)
    const [open1,setOpen1]=useState(false)

        
    
useEffect(() => {
  const tempToken = localStorage.getItem("webtoken");
  setToken(tempToken);

  if (tempToken) {
    try {
      const decodedData = jwtDecode(tempToken);
      setRole(decodedData.role);
      setName(decodedData.name)
    } catch (error) {
      console.log("Token decode failed");
    }
  }
}, [isLoggedIn]); 
    function handleLogout(e){
        localStorage.removeItem("webtoken");
        navigate('/')
        window.location.reload();

    }
    
   

    return(
        <header className="w-[100vw] h-[15vh] bg-[#03a9f4] shadow-lg flex justify-between items-center hover:shadow-2xl">
            <div className="w-[25vw] h-[100%]   flex justify-center items-center">
                 <img
          src="\images\opportuneLogo.png"alt="Opportune logo"className="h-48 object-contain"/>

                
            </div>
            <div className="w-[55vw] h-[100%] hidden lg:block ">
                <ul className=" flex mt-10 justify-evenly font-medium text-[20px]">
                    <li><NavLink to='/'className={({ isActive }) =>
    `relative px-2 py-1 transition-all duration-300 
     ${isActive ? 'after:scale-x-100 text-blue-600 font-bold' : 'after:scale-x-0 text-gray-700'}
     after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full 
     after:bg-blue-600 after:transition-transform after:duration-300 after:origin-left`}>Home</NavLink></li>
     
     
    {((!isLoggedIn)||(role==="seeker"))&&
           <li><NavLink to='/browsejobs'  className={({ isActive }) =>
    `relative px-2 py-1 transition-all duration-300 
     ${isActive ? 'after:scale-x-100 text-blue-600 font-bold' : 'after:scale-x-0 text-gray-700'}
     after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full 
     after:bg-blue-600 after:transition-transform after:duration-300 after:origin-left`}>Browse Jobs</NavLink></li>
}

    
     
                 
      {((!isLoggedIn)||(role==="poster"))&&
       <li><NavLink to='/postajob'  className={({ isActive }) =>
    `relative px-2 py-1 transition-all duration-300 
     ${isActive ? 'after:scale-x-100 text-blue-600 font-bold' : 'after:scale-x-0 text-gray-700'}
     after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full 
     after:bg-blue-600 after:transition-transform after:duration-300 after:origin-left`}>Post a Job</NavLink></li>}    


    {isLoggedIn?<div className={` flex flex-col justify-center items-start gap-2 rounded-lg shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out
      text-[14px]  z-10 ${open ? 'h-80 min-w-32 rounded-md bg-[#61c7f7]' : 'min-h-8 min-w-32 bg-[#61c7f7] rounded-md'}`}
><div className="flex justify-between items-center w-[80%]  my-1 mx-2"><div className="flex flex-col text-gray-800">{name&&<NavLink to='dashboard'>{name.split(" ")[0].toUpperCase()}</NavLink>}
  <p>{role.charAt(0).toUpperCase() + role.slice(1)}</p></div><svg   onClick={()=>{setOpen(prev=>!prev)}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={` cursor-pointer size-4 ${open?"rotate-x-180":"rotate-0"}`}>
  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
</svg>
</div>

<div className={`${open ? "flex":"hidden"} mx-2 flex-col `}>
  
  <p><NavLink to='/changepassword'className={({ isActive }) =>
    `relative px-2 py-1 transition-all duration-300 
     ${isActive ? 'after:scale-x-100 text-blue-600 font-bold' : 'after:scale-x-0 text-gray-700'}
     after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full 
     after:bg-blue-600 after:transition-transform after:duration-300 after:origin-left`}>Change Password</NavLink></p>
</div>

</div>
   
       : <li><NavLink to='/login'  className={({ isActive }) =>
    `relative px-2 py-1 transition-all duration-300 
     ${isActive ? 'after:scale-x-100 text-blue-600 font-bold' : 'after:scale-x-0 text-gray-700'}
     after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full 
     after:bg-blue-600 after:transition-transform after:duration-300 after:origin-left`}>Login</NavLink></li>}
  
      {isLoggedIn?<button onClick={handleLogout} className='h-9 w-24 text-white rounded-lg bg-red-500 hover:bg-white hover:text-red-500'>Log Out</button>:<li><NavLink to='/signup' className={({ isActive }) =>
    `relative px-2 py-1 transition-all duration-300 
     ${isActive ? 'after:scale-x-100 text-blue-600 font-bold' : 'after:scale-x-0 text-gray-700'}
     after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full 
     after:bg-blue-600 after:transition-transform after:duration-300 after:origin-left`}>Sign Up</NavLink></li>
}              
                    
                </ul>

            </div>
            <div className={` mx-[-4px]  ${open1 ?"h-[55vh] w-20":"w-20 h-[102%] "}  flex flex-col lg:hidden justify-center items-center`}>
           <div
  onClick={() => setOpen1(prev => !prev)}
  className="flex flex-col justify-between w-6 h-5 cursor-pointer z-20"
>
  <span className={`h-0.5 bg-black transition-all duration-300 ${open1 ? 'rotate-45 translate-y-2' : ''}`}></span>
  <span className={`h-0.5 bg-black transition-all duration-300 ${open1 ? 'opacity-0' : ''}`}></span>
  <span className={`h-0.5 bg-black transition-all duration-300 ${open1 ? '-rotate-45 -translate-y-2' : ''}`}></span>
</div>
{open1 && (
  <div className="absolute top-[12vh] right-0 w-full bg-white flex flex-col items-center gap-4 py-6 transition-all duration-300 z-10 lg:hidden">
    <NavLink to='/' className={`text-lg font-semibold text-gray-700`}>Home</NavLink>
    {((!isLoggedIn)||(role==="seeker")) && <NavLink to='/browsejobs' className="text-lg font-semibold text-gray-700">Browse Jobs</NavLink>}
    {((!isLoggedIn)||(role==="poster")) && <NavLink to='/postajob' className="text-lg font-semibold text-gray-700">Post a Job</NavLink>}
     {isLoggedIn && <NavLink to='/dashboard' className="text-lg font-semibold text-gray-700">Dashboard</NavLink>}
    {isLoggedIn && <NavLink to='/changepassword' className="text-lg font-semibold text-gray-700">Change Password</NavLink>}
    {!isLoggedIn && <NavLink to='/login' className="text-lg font-semibold text-gray-700">Login</NavLink>}
    {!isLoggedIn && <NavLink to='/signup' className="text-lg font-semibold text-gray-700">Sign Up</NavLink>}
    {isLoggedIn && <button onClick={handleLogout} className="text-red-500 font-semibold">Logout</button>}
  </div>
)}

 


            </div>

        </header>
        
         

      
    )
}
export default Header



