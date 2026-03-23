import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="bg-black text-white px-8 py-4 flex items-center justify-between shadow-md h-20">
      <h1 className="font-bold text-2xl tracking-wide">Online Job Fair</h1>
      <div className="flex gap-8 font-medium items-center">
        <Link to="/" className="hover:text-gray-300 transition">Home</Link>
        {token ? (
          <button onClick={handleLogout} className="bg-white text-black px-4 py-1.5 rounded-md hover:bg-gray-200 transition text-sm">Logout</button>
        ) : (
          <>
            <Link to="/register" className="hover:text-gray-300 transition">Register</Link>
            <Link to="/login" className="bg-[#52C41A] text-white px-5 py-1.5 rounded-md hover:bg-green-600 transition text-sm">Login</Link>
          </>
        )}
      </div>
    </div>
  );
}