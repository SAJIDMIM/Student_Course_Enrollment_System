import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, GraduationCap, AlertCircle } from "lucide-react";
import GlassLayout from "../components/GlassLayout";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Check for redirect message from protected route
  useEffect(() => {
    const message = location.state?.message;
    if (message) {
      setLoginError(message);
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Real-world validation logic
  const validate = () => {
    const newErrors = {};

    // Email/Username: at least 3 chars
    if (!emailOrUsername.trim()) {
      newErrors.emailOrUsername = "Username or Email is required";
    } else if (emailOrUsername.trim().length < 3) {
      newErrors.emailOrUsername = "Must be at least 3 characters";
    }

    // Password: at least 6 chars, 1 uppercase, 1 lowercase, 1 number
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "Password must contain at least one lowercase letter";
    } else if (!/\d/.test(password)) {
      newErrors.password = "Password must contain at least one number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    
    if (!validate()) return;

    setLoading(true);
    
    try {
      const result = await login(emailOrUsername.trim(), password);
      
      if (result.success) {
        // Redirect to the page they tried to visit or dashboard
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      } else {
        setLoginError(result.error || "Invalid email or password");
      }
    } catch (err) {
      setLoginError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearLoginError = () => {
    setLoginError("");
  };

  return (
    <GlassLayout
      title="Campus.com"
      subtitle="Welcome back! Please sign in to continue."
      icon={<GraduationCap className="h-8 w-8 text-white" />}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message Banner */}
        <AnimatePresence>
          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-start gap-2"
            >
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400 flex-1">{loginError}</p>
              <button
                type="button"
                onClick={clearLoginError}
                className="text-red-400 hover:text-red-300"
              >
                <EyeOff className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Username/Email */}
        <div className="space-y-1">
          <label htmlFor="emailOrUsername" className="block text-sm font-medium text-gray-200">
            Username or Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              id="emailOrUsername"
              type="text"
              placeholder="username or your.email@example.com"
              value={emailOrUsername}
              onChange={(e) => {
                setEmailOrUsername(e.target.value);
                // Clear field error when user starts typing
                if (errors.emailOrUsername) {
                  setErrors((prev) => ({ ...prev, emailOrUsername: "" }));
                }
              }}
              className={`pl-10 w-full rounded-xl border px-3 py-2 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#341f97] focus:border-[#341f97] transition-all duration-200 ${
                errors.emailOrUsername ? "border-red-500" : "border-transparent"
              }`}
              style={{ backgroundColor: "rgba(52,31,151,0.2)" }}
            />
          </div>
          {errors.emailOrUsername && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-400"
            >
              {errors.emailOrUsername}
            </motion.p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-200">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                // Clear field error when user starts typing
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: "" }));
                }
              }}
              className={`pl-10 pr-10 w-full rounded-xl border px-3 py-2 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#341f97] focus:border-[#341f97] transition-all duration-200 ${
                errors.password ? "border-red-500" : "border-transparent"
              }`}
              style={{ backgroundColor: "rgba(52,31,151,0.2)" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-400"
            >
              {errors.password}
            </motion.p>
          )}
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => alert("Please contact your administrator to reset your password.")}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Forgot password?
          </button>
        </div>

        {/* Sign In Button */}
        <motion.button
          type="submit"
          disabled={loading}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(52,31,151,0.7)" }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="w-full py-3 rounded-xl text-white font-semibold shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{ background: "linear-gradient(90deg, #341f97, #5e3bd7)" }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white"></div>
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </motion.button>
      </form>
    </GlassLayout>
  );
};

export default Login;