import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, GraduationCap } from "lucide-react";
import { z } from "zod";
import GlassLayout from "../components/GlassLayout";

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const success = await login(email, password); // AuthContext handles admin/backend login
    setLoading(false);

    if (success) navigate("/");
    else alert("Invalid email or password");
  };

  return (
    <GlassLayout
      title="Campus.com"
      subtitle="Welcome back! Please sign in to continue."
      icon={<GraduationCap className="h-8 w-8 text-white" />}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-200">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 w-full rounded-xl border px-3 py-2 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#341f97] focus:border-[#341f97] transition-all duration-200"
              style={{ backgroundColor: "rgba(52,31,151,0.2)" }}
            />
          </div>
          {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
        </div>

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
              className="pl-10 pr-10 w-full rounded-xl border px-3 py-2 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#341f97] focus:border-[#341f97] transition-all duration-200"
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
          {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105"
          style={{ background: "linear-gradient(90deg, #341f97, #5e3bd7)" }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </GlassLayout>
  );
};

export default Login;
