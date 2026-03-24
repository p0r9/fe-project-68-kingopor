import { useEffect, useState } from "react";
import { getInterviews, getCompanies, createInterview, updateInterview, deleteInterview } from "../services/API";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedId, setSelectedId] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({ date: "", company: "" });
  const [isAuthed, setIsAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalError, setModalError] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthed(!!token);
    setLoading(false);
    if (token) {
      fetchData();
      fetchCompanies();
    } else {
      fetchCompanies();
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getInterviews();
      if (res && res.data) {
        setData(Array.isArray(res.data) ? res.data : []);
      } else if (res && Array.isArray(res)) {
        setData(res);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error("Failed to fetch interviews", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await getCompanies();
      if (res && res.data) {
        setCompanies(res.data);
        if(res.data.length > 0) {
           setForm((prev) => ({ ...prev, company: res.data[0]._id }));
        }
      }
    } catch (err) {
      console.error("Failed to fetch companies", err);
    }
  };

  const handleOpenAdd = () => {
    setModalMode("add");
    setForm({ date: "", company: companies.length > 0 ? companies[0]._id : "" });
    setModalError("");
    setShowModal(true);
  };

  const handleOpenEdit = (i) => {
    setModalMode("edit");
    setSelectedId(i._id);
    let companyId = i.company;
    if (i.company && typeof i.company === "object") {
        companyId = i.company._id;
    }
    const dateFormatted = i.date ? new Date(i.date).toISOString().split('T')[0] : "";
    setForm({ date: dateFormatted, company: companyId || "" });
    setModalError("");
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this booking?")) {
      try {
        const res = await deleteInterview(id);
        if (res && res.success) {
          fetchData();
        }
      } catch (err) {
        console.error("Error deleting interview", err);
        alert(err.message || "Failed to delete booking");
      }
    }
  };

  const handleSubmit = async () => {
    setModalError("");
    if (!form.company) {
      setModalError("Please select a company from the dropdown.");
      return;
    }
    if (!form.date) {
      setModalError("Please select a date.");
      return;
    }

    const selectedDate = new Date(form.date);
    const minDate = new Date('2022-05-10T00:00:00');
    const maxDate = new Date('2022-05-14T00:00:00');
    if (selectedDate < minDate || selectedDate >= maxDate) {
      setModalError("Date must be between May 10th and May 13th, 2022.");
      return;
    }
    
    setModalLoading(true);
    try {
      let res;
      if (modalMode === "add") {
        res = await createInterview(form.company, { date: form.date });
      } else {
        res = await updateInterview(selectedId, { date: form.date, company: form.company });
      }
      
      if (res && res.success) {
        setShowModal(false);
        fetchData();
      } else {
        setModalError(res?.message || "Error saving booking");
      }
    } catch (err) {
      console.error("Error", err);
      setModalError(err.message || "Error saving booking");
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="px-10 py-12 max-w-6xl mx-auto min-h-[calc(100vh-80px)] bg-gray-50 relative">
      <h1 className="text-3xl font-bold text-center mb-10 text-black">Interview Booking</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse border border-gray-100">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-4 px-6 font-semibold text-gray-700 border-r border-gray-100">Date</th>
              <th className="py-4 px-6 font-semibold text-gray-700 border-r border-gray-100">User ID</th>
              <th className="py-4 px-6 font-semibold text-gray-700 border-r border-gray-100">Company</th>
              <th className="py-4 px-6 font-semibold text-gray-700 text-center w-48">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {!isAuthed ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-gray-500 italic">Please log in to view your bookings</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-gray-500 italic">No bookings found</td>
              </tr>
            ) : (
              data.map((i) => (
              <tr key={i._id} className="hover:bg-gray-50 transition border-b border-gray-100">
                <td className="py-4 px-6 text-gray-800 border-r border-gray-100 whitespace-nowrap">
                  {i.date ? new Date(i.date).toLocaleDateString() : 'N/A'}
                </td>
                <td className="py-4 px-6 text-gray-600 text-sm font-mono border-r border-gray-100 truncate max-w-37.5">
                  {typeof i.user === 'object' ? i.user?._id || 'Unknown' : i.user || 'Unknown'}
                </td>
                <td className="py-4 px-6 text-gray-800 border-r border-gray-100 font-medium">
                  {typeof i.company === 'object' ? i.company?.name || i.company?._id : i.company}
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="flex justify-center gap-3">
                    <button 
                      onClick={() => handleOpenEdit(i)} 
                      className="bg-[#8C8C8C] text-white px-5 py-1.5 rounded-md text-sm hover:bg-gray-500 transition shadow-sm font-medium"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(i._id)} 
                      className="bg-[#F5222D] text-white px-5 py-1.5 rounded-md text-sm hover:bg-red-600 transition shadow-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-8">
        {isAuthed && (
          <button 
            onClick={handleOpenAdd} 
            className="bg-[#5FBBD8] text-white font-medium px-8 py-3 rounded-md shadow-md hover:bg-cyan-500 hover:-translate-y-0.5 transition transform cursor-pointer"
          >
            Booking
          </button>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 transform transition-transform scale-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {modalMode === 'add' ? 'Add Booking' : 'Edit Booking'}
            </h2>
            
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">Date (May 10-13, 2022)</label>
              <input 
                type="date"
                min="2022-05-10"
                max="2022-05-13"
                value={form.date}
                onChange={(e) => setForm({...form, date: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#5FBBD8] transition text-gray-700" 
              />
            </div>

            <div className="mb-8">
              <label className="block text-gray-700 font-medium mb-2">Company</label>
              <select 
                value={form.company}
                onChange={(e) => setForm({...form, company: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#5FBBD8] transition text-gray-700"
              >
                <option value="" disabled>Select a Company</option>
                {companies.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            {modalError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {modalError}
              </div>
            )}

            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setShowModal(false)}
                disabled={modalLoading}
                className="px-6 py-2.5 rounded-lg text-gray-600 font-medium hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={modalLoading}
                className="px-6 py-2.5 rounded-lg bg-[#52C41A] text-white font-medium hover:bg-green-600 shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {modalLoading ? (modalMode === 'add' ? 'Submitting...' : 'Saving...') : (modalMode === 'add' ? 'Submit' : 'Save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}