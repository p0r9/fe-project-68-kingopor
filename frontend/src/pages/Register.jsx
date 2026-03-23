import { useState } from "react";
import { registerUser } from "../services/API";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", telephone: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const data = await registerUser(form);
      if (data && data.success) {
        alert("Registered successfully");
        navigate("/login");
      } else {
        alert("Registration failed");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] grid grid-cols-2 bg-white">
      <div className="flex flex-col justify-center px-16 lg:px-24 py-10">
        <h2 className="text-4xl font-bold mb-8 text-black">Register</h2>
        
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">Name</label>
          <input 
            placeholder="John Doe" 
            className="block w-full p-3 bg-[#E8E8E8] rounded-xl outline-none focus:ring-2 focus:ring-[#52C41A] transition text-gray-700 border border-transparent" 
            onChange={(e)=>setForm({...form, name:e.target.value})}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">Telephone number</label>
          <input 
            placeholder="080-000-0000" 
            className="block w-full p-3 bg-[#E8E8E8] rounded-xl outline-none focus:ring-2 focus:ring-[#52C41A] transition text-gray-700 border border-transparent" 
            onChange={(e)=>setForm({...form, telephone:e.target.value})}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">Email</label>
          <input 
            placeholder="example@email.com" 
            className="block w-full p-3 bg-[#E8E8E8] rounded-xl outline-none focus:ring-2 focus:ring-[#52C41A] transition text-gray-700 border border-transparent" 
            onChange={(e)=>setForm({...form, email:e.target.value})}
          />
        </div>

        <div className="mb-8">
          <label className="block mb-2 font-medium text-gray-700">Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            className="block w-full p-3 bg-[#E8E8E8] rounded-xl outline-none focus:ring-2 focus:ring-[#52C41A] transition text-gray-700 border border-transparent" 
            onChange={(e)=>setForm({...form, password:e.target.value})}
          />
        </div>

        <div>
          <button 
            onClick={handleSubmit} 
            className="bg-[#52C41A] text-white font-semibold rounded-xl px-12 py-3.5 hover:bg-green-600 transition shadow-sm"
          >
            Submit
          </button>
        </div>
      </div>
      <div className="h-[calc(100vh-80px)] bg-gray-100 flex items-center justify-center p-8">
        <img src="/poster.jpg" alt="CP Job Fair Poster" className="max-h-full object-contain shadow-xl rounded-lg" />
      </div>
    </div>
  );
}