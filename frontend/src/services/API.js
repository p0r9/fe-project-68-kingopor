const API_URL = process.env.REACT_APP_BACKEND_URL || "/api/v1";

export const registerUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const loginUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const getInterviews = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/interviews`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};

export const getCompanies = async () => {
  const res = await fetch(`${API_URL}/companies`);
  return res.json();
};

export const createInterview = async (companyId, data) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/companies/${companyId}/interviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateInterview = async (id, data) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/interviews/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteInterview = async (id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/interviews/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    },
  });
  return res.json();
};