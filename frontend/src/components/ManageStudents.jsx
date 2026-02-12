import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Search, CheckCircle, AlertCircle, Filter } from "lucide-react";
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
  onShowNotification,
  filterValidation
}) => {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Handle delete student
  const handleDelete = async (id, studentName) => {
    if (!window.confirm(`Are you sure you want to delete ${studentName}'s record?`)) return;
    
    setDeleteLoading(true);
    setDeletingId(id);
    
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
      setDeletingId(null);
    }
  };

  if (fetchLoading) {
    return (
      <div className="w-full rounded-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="flex justify-center items-center py-20">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/20 border-t-[#5e3bd7]"></div>
            <p className="text-gray-400 text-sm mt-4">Loading students...</p>
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
                    <p className="text-gray-400 text-sm mb-6 max-w-md">
                      Get started by adding your first student using the "Add New Student" button above.
                    </p>
                  </div>
                </td>
              </tr>
            ) : displayedStudents.length > 0 ? (
              // STUDENTS EXIST AND FILTERED RESULTS FOUND
              displayedStudents.map((student, index) => (
                <motion.tr
                  key={student._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
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
                        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors relative"
                        title="Delete Student"
                        disabled={deleteLoading}
                      >
                        {deleteLoading && deletingId === student._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-red-400"></div>
                        ) : (
                          <Trash2 className="h-4 w-4 text-red-400" />
                        )}
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
                    <div className="w-16 h-16 mb-4 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/30">
                      <Filter className="h-8 w-8 text-yellow-400" />
                    </div>
                    <p className="text-gray-300 text-lg font-medium mb-2">No matching students found</p>
                    <p className="text-gray-400 text-sm mb-4 max-w-md">
                      {filterValidation?.suggestions?.[0] || 
                       (search && filterCourse && filterCourse !== "all"
                        ? `No students matching "${search}" in ${filterCourse}`
                        : search 
                        ? `No students matching "${search}"`
                        : filterCourse && filterCourse !== "all"
                        ? `No students enrolled in ${filterCourse}`
                        : "No results found with current filters"
                       )}
                    </p>
                    {filterValidation?.suggestions && filterValidation.suggestions.length > 0 && (
                      <div className="bg-white/5 rounded-lg p-4 max-w-md text-left">
                        <p className="text-sm font-medium text-gray-300 mb-2">Suggestions:</p>
                        <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
                          {filterValidation.suggestions.slice(0, 3).map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Table Footer with Count */}
      {students.length > 0 && (
        <div className="px-6 py-3 border-t border-white/10 bg-white/5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">
              Showing {displayedStudents.length} of {students.length} students
            </span>
            {displayedStudents.length < students.length && (
              <span className="text-gray-400">
                Filtered by: {search && `"${search}"`} {filterCourse && filterCourse !== "all" && filterCourse}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;