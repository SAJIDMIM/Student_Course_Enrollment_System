import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Search, CheckCircle, AlertCircle } from "lucide-react";
import axios from "axios";
import { useState } from "react";

const API_BASE = "http://localhost:5000/api/students";

const ManageStudents = ({
  students,
  displayedStudents,
  filteredStudents,
  fetchLoading,
  search,
  filterCourse,
  onEdit,
  onRefresh,
  onShowNotification
}) => {
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Handle delete student
  const handleDelete = async (id, studentName) => {
    if (!window.confirm(`Are you sure you want to delete ${studentName}'s record?`)) return;
    
    setDeleteLoading(true);
    try {
      await axios.delete(`${API_BASE}/${id}`);
      console.log("Student deleted:", id);
      
      onShowNotification(
        "success",
        "Student Deleted Successfully",
        `${studentName}'s record has been removed from the system.`,
        <CheckCircle className="h-5 w-5" />
      );
      
      await onRefresh();
      
    } catch (err) {
      console.error("Error deleting student:", err);
      onShowNotification(
        "error",
        "Delete Failed",
        "Unable to delete student record. Please try again.",
        <AlertCircle className="h-5 w-5" />
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="w-full rounded-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="flex justify-center items-center py-20">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/20 border-t-[#5e3bd7]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/10 border-b border-white/10">
              {["Name", "Email", "Phone", "Course", "Status", "Actions"].map((header) => (
                <th 
                  key={header} 
                  className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-300"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {students.length === 0 ? (
              // NO STUDENTS IN DATABASE
              <tr>
                <td colSpan={6} className="px-6 py-16">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 mb-4 rounded-full bg-white/5 flex items-center justify-center">
                      <Plus className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-300 text-lg font-medium mb-2">No students in the system</p>
                    <p className="text-gray-400 text-sm mb-6">
                      Get started by adding your first student
                    </p>
                  </div>
                </td>
              </tr>
            ) : displayedStudents.length > 0 ? (
              // STUDENTS EXIST AND FILTERED RESULTS FOUND
              displayedStudents.map((student, index) => (
                <motion.tr
                  key={student._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-white/5 transition-colors duration-150 group"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{student.name || "N/A"}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{student.email || "N/A"}</td>
                  <td className="px-6 py-4 text-gray-300">{student.phone || "N/A"}</td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300">{student.course || "N/A"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        student.status === "Active"
                          ? "bg-green-500/20 text-green-300 border border-green-500/30"
                          : student.status === "Pending"
                          ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                          : student.status === "Graduated"
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          : "bg-red-500/20 text-red-300 border border-red-500/30"
                      }`}
                    >
                      {student.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onEdit(student)}
                        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                        title="Edit Student"
                        disabled={deleteLoading}
                      >
                        <Edit2 className="h-4 w-4 text-blue-400" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(student._id, student.name)}
                        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                        title="Delete Student"
                        disabled={deleteLoading}
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              // FILTERED RESULTS NOT FOUND
              <tr>
                <td colSpan={6} className="px-6 py-16">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 mb-4 rounded-full bg-white/5 flex items-center justify-center">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-300 text-lg font-medium mb-2">No matching students found</p>
                    <p className="text-gray-400 text-sm mb-6">
                      {search && filterCourse 
                        ? `No students matching "${search}" in ${filterCourse}`
                        : search 
                        ? `No students matching "${search}"`
                        : `No students in ${filterCourse}`
                      }
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageStudents;