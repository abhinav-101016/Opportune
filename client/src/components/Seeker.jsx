import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Lottie from "lottie-react";
import BgAnimation from '../animations/bgAni.json'

function Seeker() {
    const apiUrl = import.meta.env.VITE_API_URL;

    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    const [seekerData, setSeekerData] = useState({
        experience: '',
        skills: [],  // This is stored as array
        email: ''
    });

    // New state just to hold skills as a string
    const [skillsInput, setSkillsInput] = useState('');

    const signupComplete = localStorage.getItem('signupComplete');
    const isSeeker=localStorage.getItem('isSeeker');

    useEffect(() => {
        const email = localStorage.getItem('email');
        if (email) {
            setSeekerData((prev) => ({ ...prev, email }));
        }
    }, []);

    useEffect(() => {
        if (!signupComplete||!isSeeker) {
            navigate('/signup');
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'skills') {
            // Update only the input text, not the array
            setSkillsInput(value);
        } else {
            setSeekerData({ ...seekerData, [name]: value });
        }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const skillsArray = skillsInput
        .split(',')
        .map(skill => skill.trim().toLowerCase())
        .filter(skill => skill !== '');

    const finalData = {
        ...seekerData,
        skills: skillsArray
    };

    const res = await fetch(`${apiUrl}/api/auth/seeker`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
    });

    const result = await res.json();

    if (res.ok) {
        setMessage('Profile Completed');
    } else {
        setMessage('Something Went Wrong maybe');
        console.log(res);
    }
};


    return (
        <div className="h-screen w-screen bg-gray-100 flex flex-col justify-center items-center">
             <div className="absolute inset-0 z-0 flex flex-1 justify-center items-center opacity-80 pointer-events-none  ">
          <Lottie 
            animationData={BgAnimation} 
            loop 
            autoplay 
            style={{ width: '100%', height: '100%',opacity: 0.5 }}
          />
        </div>
            <h2 className="pb-4 text-2xl font-medium text-gray-700">Complete Profile</h2>
            <div className="min-h-64 min-w-[45%] bg-white-200  bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-200 flex flex-col justify-center rounded-md shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <form onSubmit={handleSubmit} className="flex flex-col p-12 font-medium text-gray-900 gap-3">
                    <label>Experience (yrs)</label>
                    <input
                        type="text"
                        name="experience"
                        value={seekerData.experience}
                        onChange={handleChange}
                        className="border-gray-400 border-1 p-1"
                    />

                    <label>Skills (comma-separated)</label>
                    <input
                        type="text"
                        name="skills"
                        value={skillsInput}
                        onChange={handleChange}
                        placeholder="e.g. Graphic Design, Photography"
                        className="border-gray-400 border-1 p-1"
                    />

                    <button
                        type="submit"
                        className="  mt-2 m-auto sm:w-[30%] h-8  w-[75%] md:h-10 bg-gradient-to-r from-[#03a9f4] via-[#3caee3] to-[#0184c1] hover:bg-gradient-to-br focus:ring-2 focus:outline-[#03a9f4] focus:ring-[#76c7ed] dark:focus:ring-[#03a9f4]  text-white font-semibold rounded-md shadow-md transition-all"
                    >
                        Submit
                    </button>
                </form>
                <p className="m-auto mb-4  font-bold  text:xl sm:text-2xl text-gray-700">{message}</p>
            </div>
        </div>
    );
}

export default Seeker;
