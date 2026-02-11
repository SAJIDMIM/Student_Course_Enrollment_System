import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-white/20 border-t-white mb-4"></div>
          <p className="text-lg font-medium">Loading your dashboard...</p>
          <p className="text-sm text-gray-300 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <Navigate 
        to="/login" 
        replace 
        state={{ 
          from: location,
          message: "Please login to access this page"
        }} 
      />
    );
  }

  // Check if token exists and is valid (optional)
  const token = localStorage.getItem("token");
  if (!token) {
    return (
      <Navigate 
        to="/login" 
        replace 
        state={{ 
          from: location,
          message: "Session expired. Please login again."
        }} 
      />
    );
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;