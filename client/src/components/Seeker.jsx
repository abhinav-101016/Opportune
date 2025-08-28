import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Seeker() {
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

    const res = await fetch('http://localhost:1200/seeker', {
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
        <div className="h-screen w-screenbg-radial-[at_45%_50%] from-[#d1e8e7] to-[#0db9c5] flex flex-col justify-center items-center">
            <h2 className="pb-4 text-2xl font-bold text-blue-500">Complete Profile</h2>
            <div className="min-h-64 min-w-[45%] bg-white flex flex-col justify-center rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <form onSubmit={handleSubmit} className="flex flex-col p-12 font-medium text-gray gap-2">
                    <label>Experience (yrs)</label>
                    <input
                        type="text"
                        name="experience"
                        value={seekerData.experience}
                        onChange={handleChange}
                        className="border-blue-300 border-2 p-1"
                    />

                    <label>Skills (comma-separated)</label>
                    <input
                        type="text"
                        name="skills"
                        value={skillsInput}
                        onChange={handleChange}
                        placeholder="e.g. Graphic Design, Photography"
                        className="border-blue-300 border-2 p-1"
                    />

                    <button
                        type="submit"
                        className="mt-2 m-auto w-[30%] h-8 bg-blue-500 text-white font-semibold rounded-md shadow-md transition-all"
                    >
                        Submit
                    </button>
                </form>
                <p className="m-auto mb-4 text-2xl font-bold text-blue-600">{message}</p>
            </div>
        </div>
    );
}

export default Seeker;
