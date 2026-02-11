import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // ✅ useAuth() hook replaces useContext(AuthContext)

  if (!user) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
