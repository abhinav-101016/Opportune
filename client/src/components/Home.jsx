import { useState } from "react";
import { NavLink } from 'react-router-dom';





function Home(){

    return(
       <div className="h-[100vh] w-[100vw] bg-gray-100">
        

   


        <div className="h-[55%] w-[100%] flex justify-center items-end ">
        <div className="h-[90%] w-[100%] flex justify-around items-center  ">
            <div className="w-[55%] h-[100%] ml-10 mt-15 flex flex-col items-start justify-center ">
                <h2 className="text-4xl font-medium text-[#03a9f4]">Connecting Talent with </h2>
                <h1 className="text-6xl font-bold mb-20 text-[#03a9f4]"> Opportunity</h1>
               
            </div>
            <div className="w-[45%] h-[100%]"></div>
            </div>
           
        </div>
        <div></div>
       </div>
    )
}
export default Home