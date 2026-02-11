import React from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth(); // ✅ useAuth() hook replaces useContext(AuthContext)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white p-4">
      <div className="glass p-8 rounded-xl w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome, {user?.name}</h1>
        <p className="mb-6">You are logged in as {user?.email}</p>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 py-2 px-6 rounded-xl font-semibold"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
