import { useState } from "react";
import { motion } from "framer-motion";
import { X, ChevronDown, Edit2, Plus, CheckCircle, AlertCircle } from "lucide-react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/students";

const StudentFormModal = ({
  editingStudent,
  onClose,
  onSuccess,
  onShowNotification,
  courseOptions,
  statusOptions
}) => {
  const [formData, setFormData] = useState({
    name: editingStudent?.name || "",
    email: editingStudent?.email || "",
    phone: editingStudent?.phone || "",
    course: editingStudent?.course || courseOptions[0],
    status: editingStudent?.status || statusOptions[1],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = "Name is required";
    if (!formData.email?.match(/^\S+@\S+\.\S+$/)) newErrors.email = "Valid email is required";
    if (!formData.phone?.match(/^\d+$/)) newErrors.phone = "Phone number must contain digits only";
    if (!formData.course) newErrors.course = "Course is required";
    if (!formData.status) newErrors.status = "Status is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async () => {
    if (!validateForm()) {
      onShowNotification(
        "error",
        "Validation Failed",
        "Please check the form for errors.",
        <AlertCircle className="h-5 w-5" />
      );
      return;
    }
    
    setLoading(true);
    
    try {
      const studentData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        course: formData.course,
        status: formData.status
      };

      let response;
      let studentName = studentData.name;
      
      if (editingStudent) {
        // UPDATE existing student
        response = await axios.put(`${API_BASE}/${editingStudent._id}`, studentData);
        console.log("Student updated:", response.data);
        
        onShowNotification(
          "success",
          "Student Updated Successfully",
          `${studentName}'s record has been updated in the database.`,
          <CheckCircle className="h-5 w-5" />
        );
      } else {
        // CREATE new student
        response = await axios.post(API_BASE, studentData);
        console.log("Student created:", response.data);
        
        onShowNotification(
          "success",
          "Student Added Successfully",
          `${studentName} has been enrolled and added to the system.`,
          <CheckCircle className="h-5 w-5" />
        );
      }

      await onSuccess();
      
    } catch (err) {
      console.error("Error saving student:", err);
      
      if (err.response?.status === 400) {
        setErrors({ email: "Student with this email already exists" });
        onShowNotification(
          "error",
          "Duplicate Email Detected",
          "A student with this email address is already registered.",
          <AlertCircle className="h-5 w-5" />
        );
      } else {
        onShowNotification(
          "error",
          "Operation Failed",
          "Unable to save student record. Please try again.",
          <AlertCircle className="h-5 w-5" />
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.3 }}
        className="relative w-full max-w-2xl bg-[#1a1a2e] rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {editingStudent ? "Edit Student" : "Add New Student"}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {editingStudent ? "Update the student information below" : "Fill in the student details below"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full h-11 px-4 rounded-lg bg-[#0f0f1a] border ${
                  errors.name ? "border-red-500/50" : "border-white/10"
                } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5e3bd7] focus:border-transparent transition-all text-sm`}
              />
              {errors.name && (
                <p className="text-xs text-red-400 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full h-11 px-4 rounded-lg bg-[#0f0f1a] border ${
                  errors.email ? "border-red-500/50" : "border-white/10"
                } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5e3bd7] focus:border-transparent transition-all text-sm`}
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone Input */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                placeholder="1234567890"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full h-11 px-4 rounded-lg bg-[#0f0f1a] border ${
                  errors.phone ? "border-red-500/50" : "border-white/10"
                } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5e3bd7] focus:border-transparent transition-all text-sm`}
              />
              {errors.phone && (
                <p className="text-xs text-red-400 mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Course Select */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">
                Course <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full h-11 px-4 rounded-lg bg-[#0f0f1a] border border-white/10 text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#5e3bd7] focus:border-transparent transition-all text-sm"
                >
                  {courseOptions.map((course) => (
                    <option key={course} value={course} className="bg-[#0f0f1a] text-white py-2">
                      {course}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Status Select */}
            <div className="space-y-1.5 md:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-300">
                Status <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full h-11 px-4 rounded-lg bg-[#0f0f1a] border border-white/10 text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#5e3bd7] focus:border-transparent transition-all text-sm"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status} className="bg-[#0f0f1a] text-white py-2">
                      {status}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex items-center justify-end gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-white/20 text-gray-300 hover:bg-white/10 transition-colors text-sm font-medium"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#5e3bd7] to-[#341f97] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                {editingStudent ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                <span>{editingStudent ? "Update Student" : "Add Student"}</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentFormModal;