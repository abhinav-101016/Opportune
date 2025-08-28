import { useState } from "react";
import { NavLink } from 'react-router-dom';



function Home(){

    return(
       <div className="h-[85vh] w-[100vw] bg-radial-[at_45%_50%] from-[#d1e8e7] to-[#0db9c5]">
        <div className="h-[55%] w-[100%] flex justify-center items-end ">
        <div className="h-[90%] w-[100%] bg-gradient-to-r from-[#0e7490] via-[#3b82f6] to-[#4f46e5] flex justify-around items-center shadow-lg ">
            <div className="w-[55%] h-[100%] ml-10 mt-15 flex flex-col items-start justify-center ">
                <h2 className="text-4xl font-medium text-white">Connecting Talent with</h2>
                <h1 className="text-6xl font-bold mb-20 text-white"> Opportunity</h1>
               
            </div>
            <div className="w-[45%] h-[100%]"></div>
            </div>
           
        </div>
        <div></div>
       </div>
    )
}
export default Home