import { createContext, useContext,useState } from "react";

const LoginContext=createContext()

export function LoginProvider({children}){
    const [isLoggedIn,setIsLoggedIn]=useState(!!localStorage.getItem('webtoken'))

    return(
        <LoginContext.Provider value={{isLoggedIn,setIsLoggedIn}}>
            {children}
        </LoginContext.Provider>
    )
}

export function useLogin(){
    return useContext(LoginContext)

}






