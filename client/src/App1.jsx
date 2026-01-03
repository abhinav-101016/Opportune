import React from "react";
import { BrowserRouter as Router, Routes, Route }  from "react-router-dom";
import SignUp1 from "./components/SignUp1";
import Login from "./components/Login";
import { useEffect } from "react";

import './App.css'
import Seeker from "./components/Seeker";
import Poster from "./components/Poster";
import Home from "./components/Home";
import Header from "./components/Header";
import JobPost from "./components/JobPost";
import { LoginProvider } from "./Context/LoginContext";
import ChangePassword from "./components/ChangePassword";
import Dashboard from "./components/Dashboard";
import DeleteProfile from "./components/DeleteProfile";
import BrowseJobs from "./components/BrowseJobs";
import Apply from "./components/Apply";
import EmailVerify from "./components/EmailVerify"
import JobsPosted from "./components/JobsPosted";
import Applications from "./components/Applications";
import SeekerApplications from "./components/SeekerApplications";


const App1=()=>{

    


    useEffect(() => {
        // clear specific keys
        localStorage.removeItem("signupComplete");
        localStorage.removeItem("isSeeker");
        localStorage.removeItem("email");
    }, []);

    return(
        
        <Router>
            <LoginProvider>
             <Header/>
            <Routes>
               
                <Route path="/" element={<Home/>}/>
                <Route path="/signup" element={<SignUp1/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/seeker-complete-profile" element={<Seeker/>}/>
                <Route path="/poster-complete-profile" element={<Poster/>}/>
                <Route path="/postajob" element={<JobPost/>}/>
                <Route path="/changepassword" element={<ChangePassword/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/deleteprofile" element={<DeleteProfile/>}/>
                <Route path="/browsejobs" element={<BrowseJobs/>}/>
                <Route path="/apply" element={<Apply/>}/>
                <Route path="/jobsposted" element={<JobsPosted/>}/>
                <Route path="/applications" element={<Applications/>}/>
                <Route path="/seeapplications" element={<SeekerApplications/>}/>
                <Route path="/verify-email" element={<EmailVerify/>}/>
                
            </Routes>
            </LoginProvider>
        </Router>
    )
}
export default App1