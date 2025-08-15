import React from "react";
import { useState } from "react";

const SignUp=()=>{
const [formData,setFormData]=useState({
    name:'',

    email:'',
    mob:'',
    password:''
});
const [message,setMessage]=useState('');
const handleChange=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
}

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch('http://localhost:4200/SignUp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await res.json();

    if (res.ok) {
      setMessage('Sign-Up Successful');
      setFormData({ name: '', email: '', mob: '', password: '' });
    } else {
      setMessage(`Error: ${result.error || 'Something went wrong'}`);
    }
  } catch (error) {
    console.error(error);
    setMessage('Server error. Try again later.');
  }
};




return(
<>
<div >
    <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange}required></input>
        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required></input>
          <label>Mobile No:</label>
        <input type="tel" name="mob" value={formData.mob} onChange={handleChange} required></input>
          <label>Email</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required></input>
        <button type="submit">Sign In</button>

       
    </form>
</div>


</>)

}

export default SignUp