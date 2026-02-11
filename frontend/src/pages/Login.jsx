import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, GraduationCap, AlertCircle } from "lucide-react";
import GlassLayout from "../components/GlassLayout";
import { motion } from "framer-motion";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError("");
    
    const result = await login(email.trim(), password);
    
    if (result.success) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } else {
      setError(result.error || "Invalid email or password");
    }
    
    setLoading(false);
  };

  return (
    <GlassLayout
      title="Campus.com"
      subtitle="Welcome back! Please sign in to continue."
      icon={<GraduationCap className="h-8 w-8 text-white" />}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-2"
          >
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="text-sm text-red-400 flex-1">{error}</p>
          </motion.div>
        )}

        {/* Email Input */}
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-200">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              id="email"
              type="email"
              placeholder="admin@campus.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 w-full rounded-xl border border-transparent px-3 py-2 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#341f97] focus:border-[#341f97] transition-all duration-200"
              style={{ backgroundColor: "rgba(52,31,151,0.2)" }}
            />
          </div>
        </div>

        {/* Password Input */}
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
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 w-full rounded-xl border border-transparent px-3 py-2 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#341f97] focus:border-[#341f97] transition-all duration-200"
              style={{ backgroundColor: "rgba(52,31,151,0.2)" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Sign In Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-xl text-white font-semibold shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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